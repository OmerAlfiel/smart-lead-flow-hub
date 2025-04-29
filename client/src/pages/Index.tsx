
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <svg 
                className="h-8 w-8 text-brand-600" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M18 8C18 12.4183 14.4183 16 10 16C5.58172 16 2 12.4183 2 8C2 3.58172 5.58172 0 10 0C14.4183 0 18 3.58172 18 8Z" 
                  fill="currentColor" 
                />
                <path 
                  d="M22 19C22 21.7614 19.7614 24 17 24C14.2386 24 12 21.7614 12 19C12 16.2386 14.2386 14 17 14C19.7614 14 22 16.2386 22 19Z" 
                  fill="currentColor" 
                  fillOpacity="0.7" 
                />
                <path 
                  d="M7 14C7 17.866 3.86599 21 0 21L0 14H7Z" 
                  fill="currentColor" 
                  fillOpacity="0.5" 
                />
              </svg>
              <span className="text-xl font-bold text-gray-900">Smart Lead Flow Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-brand-600 hover:text-brand-500 font-medium">
                Log in
              </Link>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Streamline Your</span>
                <span className="block text-brand-600">Lead Management</span>
              </h1>
              <p className="mt-6 text-lg text-gray-500 sm:max-w-xl">
                Smart Lead Flow Hub is an intelligent lead management system that helps your sales team track, organize, and convert leads more efficiently. Save time, increase your close rate, and grow your business.
              </p>
              <div className="mt-8 space-x-4">
                <Button asChild size="lg" className="px-8">
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">Log in</Link>
                </Button>
              </div>
              <div className="mt-12">
                <p className="text-base font-medium text-gray-900">Trusted by leading companies</p>
                <div className="mt-4 flex items-center space-x-8 opacity-70">
                  <div className="h-8 w-auto text-gray-400">Company A</div>
                  <div className="h-8 w-auto text-gray-400">Brand B</div>
                  <div className="h-8 w-auto text-gray-400">Enterprise C</div>
                </div>
              </div>
            </div>
            <div className="mt-16 lg:mt-0 lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-100 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
                <div className="absolute bottom-0 -right-4 w-72 h-72 bg-blue-100 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                <div className="relative">
                  <div className="shadow-xl rounded-lg bg-white overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                      {/* Mock dashboard visualization */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-medium text-gray-900">Lead Performance</h3>
                          <div className="text-xs text-gray-500">Last 30 days</div>
                        </div>
                        <div className="flex space-x-1">
                          {Array.from({ length: 30 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-1 rounded-t"
                              style={{
                                height: `${20 + Math.random() * 50}px`,
                                backgroundColor: `rgba(59, 130, 246, ${0.5 + Math.random() * 0.5})`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white border rounded-lg p-4">
                          <div className="text-xs text-gray-500">Total Leads</div>
                          <div className="text-2xl font-bold">1,234</div>
                          <div className="text-xs text-green-500 mt-1">↑ 12% vs prev. period</div>
                        </div>
                        <div className="bg-white border rounded-lg p-4">
                          <div className="text-xs text-gray-500">Conversion Rate</div>
                          <div className="text-2xl font-bold">23.5%</div>
                          <div className="text-xs text-green-500 mt-1">↑ 3.2% vs prev. period</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="bg-white border rounded-lg p-3 flex justify-between items-center">
                          <div>
                            <div className="text-sm font-medium">John Doe</div>
                            <div className="text-xs text-gray-500">Acme Inc.</div>
                          </div>
                          <div className="bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-1">New</div>
                        </div>
                        <div className="bg-white border rounded-lg p-3 flex justify-between items-center">
                          <div>
                            <div className="text-sm font-medium">Sarah Smith</div>
                            <div className="text-xs text-gray-500">Tech Solutions</div>
                          </div>
                          <div className="bg-yellow-100 text-yellow-800 text-xs rounded-full px-2 py-1">Qualified</div>
                        </div>
                        <div className="bg-white border rounded-lg p-3 flex justify-between items-center">
                          <div>
                            <div className="text-sm font-medium">Alex Johnson</div>
                            <div className="text-xs text-gray-500">Global Industries</div>
                          </div>
                          <div className="bg-green-100 text-green-800 text-xs rounded-full px-2 py-1">Won</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              All-in-one lead management solution
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need to track, nurture, and convert more leads.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Lead Capture & Management</h3>
                <p className="mt-2 text-base text-gray-500">
                  Easily capture, organize, and manage all your leads in one centralized location.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Performance Analytics</h3>
                <p className="mt-2 text-base text-gray-500">
                  Track conversion rates, sales pipeline, and performance with intuitive dashboards.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Task Management</h3>
                <p className="mt-2 text-base text-gray-500">
                  Schedule follow-ups, set reminders, and never miss a lead opportunity again.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Secure & Compliant</h3>
                <p className="mt-2 text-base text-gray-500">
                  Enterprise-grade security that keeps your lead data safe and compliant.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Customizable Reports</h3>
                <p className="mt-2 text-base text-gray-500">
                  Create custom reports to track the metrics that matter most to your business.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">AI-Powered Insights</h3>
                <p className="mt-2 text-base text-gray-500">
                  Get intelligent suggestions and insights to optimize your lead conversion strategy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready to grow your business?
              </h2>
              <p className="mt-4 text-lg text-brand-100">
                Start converting more leads today with Smart Lead Flow Hub. Set up in minutes, no credit card required.
              </p>
              <div className="mt-8">
                <Button asChild size="lg" variant="secondary" className="px-6">
                  <Link to="/signup">Start Free Trial</Link>
                </Button>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-12 w-12 rounded-full" 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" 
                      alt="Testimonial" 
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold">Jane Smith</h4>
                    <p className="text-gray-500">Sales Director, TechCorp</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Smart Lead Flow Hub has transformed our sales process. We've increased our lead conversion rate by 43% and saved countless hours on manual lead management tasks."
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Product</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Features</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Security</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">About</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">API Reference</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Tutorials</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Cookie Policy</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-400">
              &copy; {new Date().getFullYear()} Smart Lead Flow Hub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
