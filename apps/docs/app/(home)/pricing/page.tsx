import { Check, Crown, Shield, Sparkles, Users, Code, Newspaper } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { createMetadata } from '@/lib/metadata';
import Link from 'fumadocs-core/link';

export const metadata = createMetadata({
  title: 'Pricing - API Key Plans',
  description: 'Choose the perfect API plan for your JKT48 project',
  openGraph: {
    url: 'https://docs.jkt48connect.my.id/pricing',
  },
});

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  limit: number | string;
  expireDays: number | string;
  features: PlanFeature[];
  highlighted?: boolean;
  cta: string;
  ctaLink: string;
  icon: React.ReactNode;
}

const plans: PricingPlan[] = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'Perfect for testing and small projects',
    limit: '2,500',
    expireDays: '30 days',
    icon: <Sparkles className="w-6 h-6" />,
    features: [
      { text: '2,500 requests per month', included: true },
      { text: '30 days validity', included: true },
      { text: 'Rate limiting applied', included: true },
      { text: 'IP whitelist required', included: true },
      { text: 'Community support', included: true },
      { text: 'Priority support', included: false },
      { text: 'Custom Apikey', included: false },
      { text: 'Custom rate limits', included: false },
    ],
    cta: 'Get Started',
    ctaLink: '/generate',
  },
  {
    name: 'Premium',
    price: 'Rp 30K',
    description: 'For growing applications and developers',
    limit: '5,000',
    expireDays: '60 days',
    icon: <Crown className="w-6 h-6" />,
    features: [
      { text: '5,000 requests per month', included: true },
      { text: '60 days validity', included: true },
      { text: 'Higher rate limits', included: true },
      { text: 'IP whitelist required', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Custom Apikey', included: true },
      { text: 'Custom integrations', included: false },
    ],
    cta: 'Subscribe Now',
    ctaLink: '/subscribe/premium',
  },
  {
    name: 'Enterprise',
    price: 'Rp 75K',
    description: 'For professional teams and businesses',
    limit: '25,000',
    expireDays: '152 days',
    icon: <Shield className="w-6 h-6" />,
    highlighted: true,
    features: [
      { text: '25,000 requests per month', included: true },
      { text: '152 days validity (~5 months)', included: true },
      { text: 'Premium rate limits', included: true },
      { text: 'IP whitelist required', included: true },
      { text: '24/7 priority support', included: true },
      { text: 'Advanced analytics dashboard', included: true },
      { text: 'Custom Apikey', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'SLA guarantee', included: true },
    ],
    cta: 'Get Enterprise',
    ctaLink: '/subscribe/enterprise',
  },
  {
    name: 'Premium Plus',
    price: 'Rp 150K',
    description: 'Ultimate power for large-scale applications',
    limit: 'Unlimited',
    expireDays: 'Permanent',
    icon: <Sparkles className="w-6 h-6 text-yellow-500" />,
    features: [
      { text: 'Unlimited requests', included: true },
      { text: 'Permanent access', included: true },
      { text: 'No rate limiting', included: true },
      { text: 'IP whitelist required', included: true },
      { text: 'Dedicated support channel', included: true },
      { text: 'Custom analytics & reporting', included: true },
      { text: 'White-label options', included: true },
      { text: 'Custom Apikey', included: true },    
      { text: 'Early access to new features', included: true },
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
  },
];

interface PriorityCategory {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const priorityCategories: PriorityCategory[] = [
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Verified Communities & Fanbase',
    description: 'Registered JKT48 fan communities and official fanbase groups',
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: 'Verified Developers',
    description: 'Certified developers building JKT48-related applications',
  },
  {
    icon: <Newspaper className="w-8 h-8" />,
    title: 'Media Partners',
    description: 'Accredited media organizations covering JKT48',
  },
];

export default function PricingPage() {
  return (
    <main className="px-4 py-12 w-full max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-fd-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your JKT48 project. All plans include access to our comprehensive API.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-20">
        {plans.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </div>

      {/* Priority Token Section */}
      <div className="relative overflow-hidden border-2 border-dashed border-yellow-500/50 rounded-2xl p-8 md:p-12 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-yellow-500/20 rounded-xl">
            <Crown className="w-8 h-8 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Priority Token</h2>
            <p className="text-fd-muted-foreground">Exclusive access for verified partners</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Premium Benefits</h3>
            <ul className="space-y-3">
              {[
                'Unlimited API requests',
                'Permanent access',
                'No rate limiting',
                'No IP whitelist required',
                'Highest priority support',
                'Direct access to team',
                'Beta features access',
                'Custom Token',
                'Custom SLA agreements',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Eligible Categories</h3>
            <div className="space-y-4">
              {priorityCategories.map((category, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-fd-background/50 rounded-lg border">
                  <div className="text-fd-primary">{category.icon}</div>
                  <div>
                    <p className="font-medium text-sm mb-1">{category.title}</p>
                    <p className="text-xs text-fd-muted-foreground">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 border-t border-dashed">
          <p className="text-sm text-fd-muted-foreground">
            Are you eligible for Priority Token access?
          </p>
          <a
            href="https://forms.gle/KeqJF9nAeEq7hxWP9"
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              buttonVariants({
                variant: 'default',
                size: 'lg',
              }),
              'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
            )}
          >
            Apply for Priority Token
          </a>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">
          Compare All Features
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Feature</th>
                <th className="text-center p-4 font-medium">Basic</th>
                <th className="text-center p-4 font-medium">Premium</th>
                <th className="text-center p-4 font-medium">Enterprise</th>
                <th className="text-center p-4 font-medium">Premium Plus</th>
                <th className="text-center p-4 font-medium bg-yellow-500/10">Priority Token</th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow feature="Monthly Requests" values={['2,500', '5,000', '25,000', 'Unlimited', 'Unlimited']} />
              <ComparisonRow feature="Validity Period" values={['30 days', '60 days', '152 days', 'Permanent', 'Permanent']} />
              <ComparisonRow feature="Rate Limiting" values={['Standard', 'Higher', 'Premium', 'None', 'None']} />
              <ComparisonRow feature="IP Whitelist" values={['Required', 'Required', 'Required', 'Required', 'Not Required']} />
              <ComparisonRow feature="Support Level" values={['Community', 'Email', '24/7 Priority', 'Dedicated', 'Direct Team']} />
              <ComparisonRow feature="Analytics" values={['Basic', 'Advanced', 'Advanced', 'Custom', 'Custom']} />
              <ComparisonRow feature="Apikey Custom" values={['✗', '✓', '✓', '✓', '✓']} />
              <ComparisonRow feature="SLA Guarantee" values={['✗', '✗', '✓', '✓', '✓']} />
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <FAQItem
            question="What happens when my API key expires?"
            answer="You'll need to renew your subscription to continue using the API. All your data and configurations will be preserved."
          />
          <FAQItem
            question="Can I upgrade my plan anytime?"
            answer="Yes! You can upgrade your plan at any time. The remaining balance will be prorated towards your new plan."
          />
          <FAQItem
            question="What is IP whitelist?"
            answer="IP whitelist is a security feature that restricts API access to specific IP addresses you specify."
          />
          <FAQItem
            question="How do I apply for Priority Token?"
            answer="Fill out the application form and our team will review your eligibility within 3-5 business days."
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center border border-dashed p-12 rounded-lg">
        <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
        <p className="text-fd-muted-foreground mb-6">
          Our team is here to help you choose the right plan for your needs.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/docs"
            className={cn(
              buttonVariants({
                variant: 'outline',
              }),
            )}
          >
            Read Documentation
          </Link>
          <a
            href="https://wa.me/6285189020193"
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              buttonVariants({
                variant: 'default',
              }),
            )}
          >
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
}

function PricingCard({
  name,
  price,
  description,
  limit,
  expireDays,
  features,
  highlighted,
  cta,
  ctaLink,
  icon,
}: PricingPlan) {
  return (
    <div
      className={cn(
        'relative border rounded-xl p-6 flex flex-col',
        highlighted
          ? 'border-fd-primary shadow-lg scale-105'
          : 'border-dashed hover:border-fd-primary/50 transition-all',
      )}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-fd-primary text-fd-primary-foreground text-xs font-medium rounded-full">
          Most Popular
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-fd-primary/10 rounded-lg">{icon}</div>
        <div>
          <h3 className="font-bold text-xl">{name}</h3>
          <p className="text-sm text-fd-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{price}</span>
          {price !== 'Free' && !price.includes('Rp') && <span className="text-fd-muted-foreground">/month</span>}
        </div>
      </div>

      <div className="mb-6 p-3 bg-fd-accent rounded-lg">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-fd-muted-foreground">Monthly Limit:</span>
          <span className="font-medium">{limit} requests</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-fd-muted-foreground">Validity:</span>
          <span className="font-medium">{expireDays}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2">
            {feature.included ? (
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <span className="w-5 h-5 flex-shrink-0 text-fd-muted-foreground">✗</span>
            )}
            <span className={cn('text-sm', !feature.included && 'text-fd-muted-foreground')}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaLink}
        className={cn(
          buttonVariants({
            variant: highlighted ? 'default' : 'outline',
            className: 'w-full',
          }),
        )}
      >
        {cta}
      </Link>
    </div>
  );
}

function ComparisonRow({ feature, values }: { feature: string; values: string[] }) {
  return (
    <tr className="border-b hover:bg-fd-accent/50">
      <td className="p-4 font-medium">{feature}</td>
      {values.map((value, idx) => (
        <td
          key={idx}
          className={cn(
            'text-center p-4',
            idx === values.length - 1 && 'bg-yellow-500/5',
          )}
        >
          {value}
        </td>
      ))}
    </tr>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border border-dashed p-6 rounded-lg">
      <h4 className="font-medium mb-2">{question}</h4>
      <p className="text-sm text-fd-muted-foreground">{answer}</p>
    </div>
  );
}
