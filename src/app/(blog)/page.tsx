// src/app/(blog)/page.tsx
import { ArrowRight, TrendingUp, BookOpen, Briefcase, FileText, Download, ExternalLink, Calendar, Bell, ChevronRight, Info, Flame, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'IGNOU Study Hub & Sarkari Job Alerts | Torque News',
  description: 'Latest IGNOU announcements, study materials, notes, assignments, and Government job notifications.',
  icons: {
    icon: "/favicon.webp",
  },
};

async function getPosts(limit = 30) {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/posts?status=published&limit=${limit}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json() as any;
    return data.posts || [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json() as any;
    return data.categories || [];
  } catch {
    return [];
  }
}

function formatDate(d: Date | string | number) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

async function getHomepageSettings() {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/settings?key=homepage`, { next: { revalidate: 10 } });
    if (!res.ok) return null;
    const data = await res.json() as any;
    return data.value || null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [posts, categories, homepageSettings] = await Promise.all([
    getPosts(),
    getCategories(),
    getHomepageSettings()
  ]);

  const config = homepageSettings || {
    portals: [
      { label: "IGNOU Official Website", href: "https://www.ignou.ac.in" },
      { label: "IGNOU Student Samarth Portal", href: "https://ignou.samarth.edu.in" },
      { label: "Online Exam Form Submission", href: "https://exam.ignou.ac.in" },
      { label: "Revaluation Result Portal", href: "https://revaluation.ignou.ac.in" },
      { label: "Sarkari Job Results Board", href: "https://www.sarkaripost.com" }
    ],
    checklist: [
      { label: "June Term-End Assignments", status: "Active / Open", color: "#16a34a" },
      { label: "June Term-End Examinations Form", status: "Extended / Open", color: "#16a34a" },
      { label: "New Academic Cycle Admission", status: "Extended", color: "#b45309" },
      { label: "Hall Ticket / Admit Card link", status: "Awaiting Link", color: "#d33" },
      { label: "Grade Card Re-evaluation status", status: "Updated Daily", color: "#2563eb" }
    ],
    telegram: {
      title: "Join Telegram Channel",
      description: "Get instant notifications on your mobile for IGNOU announcements, question sheets, syllabus releases, and Government Job Alerts.",
      channelUrl: "https://t.me/ignou_study_jobs"
    }
  };

  // Distribute posts into News Sections
  const [featuredPost, ...nextPosts] = posts;
  const recentAnnouncements = nextPosts.slice(0, 4);

  // Filter posts for IGNOU Updates (contain IGNOU in title or categories)
  const ignouPosts = posts.filter((p: any) => {
    const titleMatch = p.title.toLowerCase().includes('ignou');
    const catMatch = p.categories?.some((c: any) => c.name.toLowerCase().includes('ignou') || c.slug.toLowerCase().includes('ignou'));
    return titleMatch || catMatch;
  }).slice(0, 5);

  // Filter posts for Jobs & Careers (contain job, recruitment, sarkari, apply, exam in title or categories)
  const jobPosts = posts.filter((p: any) => {
    const titleMatch = /job|vacancy|recruitment|sarkari|admit|result|hiring/i.test(p.title);
    const catMatch = p.categories?.some((c: any) => /job|vacancy|recruitment|career/i.test(c.name) || /job|vacancy|recruitment|career/i.test(c.slug));
    return titleMatch || catMatch;
  }).slice(0, 5);

  // Fallbacks if no posts matched the specific filters (helps guide setup)
  const displayIgnouPosts = ignouPosts.length > 0 ? ignouPosts : posts.slice(0, 5);
  const displayJobPosts = jobPosts.length > 0 ? jobPosts : posts.slice(4, 9);

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* SECTION 1: News Hero Spotlight Grid */}
      <section style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg-secondary) 100%)', padding: '2rem 0' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Lead Story (Left Column - Highlighted News) */}
            <div className="lg:col-span-2 flex">
              {featuredPost ? (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow)',
                  overflow: 'hidden',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                }}>
                  {featuredPost.coverImage && (
                    <div style={{ position: 'relative', height: '320px', width: '100%' }}>
                      <Image 
                        src={featuredPost.coverImage} 
                        alt={featuredPost.title} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                        priority
                      />
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: 'var(--accent)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}>
                        Spotlight
                      </div>
                    </div>
                  )}
                  
                  <div style={{ padding: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                        {featuredPost.categories?.map((c: any) => (
                          <span key={c.slug} className="badge badge-purple">{c.name}</span>
                        ))}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={12} /> {formatDate(featuredPost.createdAt)}
                        </span>
                      </div>
                      
                      <Link href={`/blog/${featuredPost.slug}`} style={{ textDecoration: 'none' }}>
                        <h1 
                          className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                          style={{
                            fontSize: '1.8rem',
                            fontWeight: 800,
                            lineHeight: 1.25,
                            color: 'var(--text)',
                            marginBottom: '1rem',
                          }}
                        >
                          {featuredPost.title}
                        </h1>
                      </Link>
                      
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        {featuredPost.excerpt}
                      </p>
                    </div>
                    
                    <Link href={`/blog/${featuredPost.slug}`} className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
                      Read Coverage <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '3rem',
                  textAlign: 'center',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                  <AlertCircle size={48} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
                  <h3 style={{ marginBottom: '0.5rem' }}>No Posts Published Yet</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Go to the Admin dashboard to add your first educational news report.</p>
                  <Link href="/admin/posts/new" className="btn btn-primary" style={{ margin: '1rem auto 0' }}>Write Post</Link>
                </div>
              )}
            </div>
            
            {/* Recent Bulletins (Right Column - List of Latest News) */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--border)' }}>
                <TrendingUp size={18} style={{ color: 'var(--accent)' }} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
                  Recent Bulletins
                </h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
                {recentAnnouncements.length > 0 ? (
                  recentAnnouncements.map((p: any, idx: number) => (
                    <div 
                      key={p.id} 
                      style={{
                        paddingBottom: idx !== recentAnnouncements.length - 1 ? '1rem' : '0',
                        borderBottom: idx !== recentAnnouncements.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span className="badge badge-gray" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
                          {p.categories?.[0]?.name || 'Updates'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                          {formatDate(p.createdAt)}
                        </span>
                      </div>
                      <Link href={`/blog/${p.slug}`} style={{ textDecoration: 'none' }}>
                        <h3 
                          className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                          style={{
                            fontSize: '0.925rem',
                            fontWeight: 700,
                            lineHeight: 1.35,
                            color: 'var(--text)',
                          }}
                        >
                          {p.title}
                        </h3>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
                    Publish more updates to see recent bulletins listed here.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Categories Strip / Topic Navigator */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div className="container">
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            overflowX: 'auto',
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              Explore Categories:
            </span>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {categories.map((c: any) => (
                <Link 
                  key={c.slug} 
                  href={`/category/${c.slug}`}
                  className="hover:border-violet-500 hover:text-violet-500 transition-colors"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: 'var(--text)',
                    background: 'var(--bg-secondary)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                  }}
                >
                  {c.name}
                </Link>
              ))}
              {categories.length === 0 && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  No categories defined. Add them in the Admin portal.
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Dashboard - Dual Column News Desk + Resource Sidebar */}
      <section>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: News Desks (IGNOU updates + Jobs alerts) */}
            <div className="lg:col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* DESK 1: IGNOU Updates & Study Materials */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow)',
                padding: '1.75rem',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '2px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={20} style={{ color: '#2563eb' }} />
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
                      IGNOU Study Desk
                    </h2>
                  </div>
                  <Link href="/category/ignou" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    View All <ChevronRight size={14} />
                  </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {displayIgnouPosts.map((p: any) => {
                    const isPdf = p.content?.includes('.pdf') || p.excerpt?.includes('.pdf');
                    return (
                      <div 
                        key={`ignou-${p.id}`} 
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          alignItems: 'flex-start',
                          paddingBottom: '1.25rem',
                          borderBottom: '1px solid var(--bg-secondary)',
                        }}
                      >
                        <div style={{
                          background: 'rgba(37, 99, 235, 0.08)',
                          color: '#2563eb',
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <FileText size={20} />
                        </div>
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                              <Calendar size={11} /> {formatDate(p.createdAt)}
                            </span>
                            {isPdf && (
                              <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.65rem', fontWeight: 700, padding: '0.05rem 0.35rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                                <Download size={10} /> PDF Notes
                              </span>
                            )}
                          </div>
                          
                          <Link href={`/blog/${p.slug}`} style={{ textDecoration: 'none' }}>
                            <h4 
                              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              style={{
                                fontSize: '0.975rem',
                                fontWeight: 700,
                                lineHeight: 1.4,
                                color: 'var(--text)',
                                marginBottom: '0.25rem',
                              }}
                            >
                              {p.title}
                            </h4>
                          </Link>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                            {p.excerpt.slice(0, 110)}...
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DESK 2: Sarkari Job Alerts & Recruitment News */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow)',
                padding: '1.75rem',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '2px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={20} style={{ color: '#16a34a' }} />
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
                      Career Opportunity Board
                    </h2>
                  </div>
                  <Link href="/category/jobs" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    View All <ChevronRight size={14} />
                  </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {displayJobPosts.map((p: any) => (
                    <div 
                      key={`job-${p.id}`} 
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-start',
                        paddingBottom: '1.25rem',
                        borderBottom: '1px solid var(--bg-secondary)',
                      }}
                    >
                      <div style={{
                        background: 'rgba(22, 163, 74, 0.08)',
                        color: '#16a34a',
                        width: '42px',
                        height: '42px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Bell size={20} />
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Calendar size={11} /> {formatDate(p.createdAt)}
                          </span>
                          <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.65rem', fontWeight: 700, padding: '0.05rem 0.35rem', borderRadius: '4px' }}>
                            Job Alert
                          </span>
                        </div>
                        
                        <Link href={`/blog/${p.slug}`} style={{ textDecoration: 'none' }}>
                          <h4 
                            className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            style={{
                              fontSize: '0.975rem',
                              fontWeight: 700,
                              lineHeight: 1.4,
                              color: 'var(--text)',
                              marginBottom: '0.25rem',
                            }}
                          >
                            {p.title}
                          </h4>
                        </Link>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                          {p.excerpt.slice(0, 110)}...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
            
            {/* RIGHT COLUMN: Sidebar (Resources, Quick Links, and Community Widgets) */}
            <div className="lg:col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* SIDEBAR WIDGET 1: Student Quick Access Portals */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow)',
                padding: '1.5rem',
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  marginBottom: '1rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '2px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}>
                  <Info size={16} style={{ color: 'var(--accent)' }} />
                  Important Portals
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {config.portals?.map((portal: any, idx: number) => (
                    <OfficialLink key={idx} href={portal.href} label={portal.label} />
                  ))}
                </div>
              </div>

              {/* SIDEBAR WIDGET 2: Alert & Admission Checklist */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow)',
                padding: '1.5rem',
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  marginBottom: '1rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '2px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}>
                  <Flame size={16} style={{ color: '#ea580c' }} />
                  Action Checklist
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {config.checklist?.map((item: any, idx: number) => (
                    <ChecklistItem key={idx} label={item.label} status={item.status} color={item.color} />
                  ))}
                </div>
              </div>

              {/* SIDEBAR WIDGET 3: Community Join Telegram (Standard Education Practice) */}
              <div style={{
                background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                color: 'white',
                borderRadius: 'var(--radius)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-md)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Background design */}
                <div style={{ position: 'absolute', top: -50, right: -50, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'white' }}>
                  {config.telegram?.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#bfdbfe', lineHeight: 1.4, marginBottom: '1.25rem' }}>
                  {config.telegram?.description}
                </p>
                <a 
                  href={config.telegram?.channelUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn" 
                  style={{
                    background: 'white',
                    color: '#1e40af',
                    fontWeight: 700,
                    width: '100%',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                >
                  Join Channel Now
                </a>
              </div>

              {/* SIDEBAR WIDGET 4: Quick Subject Tag Cloud */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow)',
                padding: '1.5rem',
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  marginBottom: '1rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '2px solid var(--border)',
                }}>
                  Quick Subjects List
                </h3>
                
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <TagLink href="/tag/mps" label="#MPS" />
                  <TagLink href="/tag/bag" label="#BAG" />
                  <TagLink href="/tag/bcom" label="#BCOM" />
                  <TagLink href="/tag/mhd" label="#MHD" />
                  <TagLink href="/tag/ignou-notes" label="#IGNOUNotes" />
                  <TagLink href="/tag/sarkari-result" label="#SarkariResult" />
                  <TagLink href="/tag/admit-card" label="#AdmitCard" />
                  <TagLink href="/tag/bank-jobs" label="#BankJobs" />
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
      
      {/* Mobile styles support */}
      <style>{`
        @media (max-width: 991px) {
          main [style*="grid-column: span 8"] {
            grid-column: span 12 !important;
          }
          main [style*="grid-column: span 4"] {
            grid-column: span 12 !important;
          }
        }
      `}</style>
      
    </div>
  );
}

// Inline Sub-components for cleaner codebase
function OfficialLink({ href, label }: { href: string; label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="hover:border-violet-500 hover:bg-violet-50/10 dark:hover:bg-violet-950/20 transition-all"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.625rem 0.875rem',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--text)',
        textDecoration: 'none',
      }}
    >
      <span>{label}</span>
      <ExternalLink size={12} style={{ color: 'var(--text-light)' }} />
    </a>
  );
}

function ChecklistItem({ label, status, color }: { label: string; status: string; color: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.4rem 0',
      borderBottom: '1px dashed var(--border)',
      fontSize: '0.85rem',
    }}>
      <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
      <span style={{ color, fontWeight: 700, fontSize: '0.75rem' }}>{status}</span>
    </div>
  );
}

function TagLink({ href, label }: { href: string; label: string }) {
  return (
    <Link 
      href={href}
      className="hover:border-violet-500 hover:text-violet-500 transition-all"
      style={{
        fontSize: '0.75rem',
        fontWeight: 600,
        padding: '0.25rem 0.5rem',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        color: 'var(--text-muted)',
        textDecoration: 'none',
      }}
    >
      {label}
    </Link>
  );
}
