import Link from 'next/link'
import { StarIcon, ChartBarIcon, ChatBubbleLeftRightIcon, ClockIcon } from '@heroicons/react/24/solid'

const features = [
  {
    icon: StarIcon,
    title: 'Smart Review Analysis',
    description: 'AI-powered sentiment analysis and topic extraction from your Google Business reviews.'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Suggested Responses',
    description: 'Get professional, personalized response suggestions for every review.'
  },
  {
    icon: ChartBarIcon,
    title: 'Analytics Dashboard',
    description: 'Track your review performance and customer sentiment over time.'
  },
  {
    icon: ClockIcon,
    title: 'Real-time Monitoring',
    description: 'Stay on top of new reviews with instant notifications and alerts.'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <StarIcon className="h-8 w-8 text-primary-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">ReviewMaster</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Manage Your Restaurant Reviews
            <span className="text-primary-600 block">with AI Intelligence</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stop losing customers to negative reviews. ReviewMaster analyzes your Google Business reviews 
            and suggests professional responses that turn critics into loyal customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary text-lg px-8 py-3">
              Start Free Trial
            </Link>
            <Link href="/demo" className="btn-secondary text-lg px-8 py-3">
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel at Review Management
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform helps restaurant owners respond professionally 
              to every review and improve their online reputation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Review Management?
          </h3>
          <p className="text-xl text-primary-100 mb-8">
            Join hundreds of restaurant owners who trust ReviewMaster to maintain their online reputation.
          </p>
          <Link href="/signup" className="bg-white text-primary-600 hover:bg-gray-50 font-bold py-3 px-8 rounded-lg text-lg transition-colors">
            Start Your Free Trial Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <StarIcon className="h-6 w-6 text-primary-400 mr-2" />
              <span className="text-xl font-bold">ReviewMaster</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 ReviewMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}