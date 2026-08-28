import { PageLayout } from '../components/layout/PageLayout'

function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <PageLayout>
      <div className="pt-24 pb-16">
        <div className="bg-[#0a0a0a] py-16 px-4 text-center mb-12">
          <h1 className="font-serif text-4xl font-bold text-white">{title}</h1>
          <p className="text-gray-400 text-sm mt-3">Last updated: January 2026</p>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">
          <div className="space-y-8 text-gray-700 text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

export function TermsPage() {
  return (
    <LegalPage title="Terms &amp; Conditions">
      <Section title="1. Agreement">
        <p>By making a booking with St Michael Car Rentals, you agree to these terms and conditions. Please read them carefully before proceeding with your reservation.</p>
      </Section>
      <Section title="2. Eligibility">
        <p>The driver must be at least 21 years old, hold a valid driver's license (Ghanaian or International), and have held the license for a minimum of 2 years. A national ID or valid passport is required at pickup.</p>
      </Section>
      <Section title="3. Booking & Payment">
        <p>All bookings are subject to vehicle availability. A booking is only confirmed once payment or a payment arrangement has been confirmed by our team. Prices are stated in Ghanaian Cedi (GH₵) and include applicable taxes.</p>
      </Section>
      <Section title="4. Security Deposit">
        <p>A refundable security deposit of GH₵500 is required at vehicle pickup. This deposit is held and returned within 3–5 business days after the vehicle is returned in good condition, minus any applicable charges for damage, excess fuel, or cleaning.</p>
      </Section>
      <Section title="5. Fuel Policy">
        <p>Vehicles are provided with a full tank of fuel. Customers are required to return the vehicle with a full tank. Failure to do so will result in a fuel charge at current market rates plus a refueling service fee.</p>
      </Section>
      <Section title="6. Liability">
        <p>St Michael Car Rentals is not liable for loss of personal property left in vehicles. The renter is responsible for any fines, penalties, or charges incurred during the rental period, including traffic violations and toll fees.</p>
      </Section>
      <Section title="7. Prohibited Use">
        <p>Vehicles may not be driven outside Ghana without written consent. Off-road driving, racing, illegal activities, driving under the influence, and subletting the vehicle are strictly prohibited.</p>
      </Section>
      <Section title="8. Governing Law">
        <p>These terms are governed by the laws of the Republic of Ghana. Any disputes shall be resolved under Ghanaian jurisdiction.</p>
      </Section>
    </LegalPage>
  )
}

export function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <Section title="1. Information We Collect">
        <p>We collect information you provide directly, including your name, email address, phone number, driver's license details, and payment information. We also collect usage data when you interact with our website.</p>
      </Section>
      <Section title="2. How We Use Your Information">
        <p>Your information is used to process bookings, communicate with you about your rental, provide customer support, send booking confirmations and updates, and improve our services. We do not sell your personal information to third parties.</p>
      </Section>
      <Section title="3. Data Security">
        <p>We use industry-standard encryption and security practices to protect your personal data. Payment information is processed securely and is never stored on our servers in plain text.</p>
      </Section>
      <Section title="4. Data Retention">
        <p>We retain your personal data for as long as necessary to fulfill the purposes for which it was collected, including legal, accounting, or reporting requirements — typically 7 years for financial records.</p>
      </Section>
      <Section title="5. Your Rights">
        <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at info@stmichaelcarrentals.com. We will respond within 30 days.</p>
      </Section>
      <Section title="6. Cookies">
        <p>Our website uses cookies to improve your browsing experience and analyze site traffic. You can control cookie settings through your browser preferences.</p>
      </Section>
      <Section title="7. Contact">
        <p>For any privacy-related questions, contact our Data Protection Officer at info@stmichaelcarrentals.com or +233 24 000 0000.</p>
      </Section>
    </LegalPage>
  )
}

export function CancellationPage() {
  return (
    <LegalPage title="Cancellation Policy">
      <Section title="Free Cancellation">
        <p>Cancellations made more than 24 hours before the scheduled pickup time are fully refundable. No cancellation fee applies.</p>
      </Section>
      <Section title="Late Cancellation">
        <p>Cancellations made less than 24 hours before pickup are subject to a cancellation fee equal to one (1) day's rental rate for the booked vehicle.</p>
      </Section>
      <Section title="No-Show">
        <p>If you fail to pick up the vehicle without notifying us, a no-show fee equivalent to one (1) day's rental rate will be charged. The remainder of any prepayment will be refunded.</p>
      </Section>
      <Section title="Refund Processing">
        <p>Approved refunds are processed within 3–7 business days. Refunds are issued to the original payment method. Mobile Money refunds may take up to 5 business days to reflect in your account.</p>
      </Section>
      <Section title="How to Cancel">
        <p>To cancel a booking, log in to your account and navigate to My Bookings. Select the booking you wish to cancel and click "Cancel Booking." Alternatively, contact us directly by phone or WhatsApp with your booking reference number.</p>
      </Section>
      <Section title="Force Majeure">
        <p>In cases of natural disasters, government restrictions, or other force majeure events, we will offer a full credit or rebooking at no additional charge.</p>
      </Section>
    </LegalPage>
  )
}

export function RentalPolicyPage() {
  return (
    <LegalPage title="Rental Policy">
      <Section title="Driver Requirements">
        <ul className="list-disc pl-5 space-y-1">
          <li>Minimum age: 21 years old</li>
          <li>Valid driver's license held for at least 2 years</li>
          <li>National ID or passport required</li>
          <li>Additional drivers must be declared and approved at pickup</li>
        </ul>
      </Section>
      <Section title="Vehicle Condition">
        <p>Vehicles are provided clean and in good working order. Before driving away, the renter and a St Michael representative will conduct a joint inspection. Any pre-existing damage will be documented. The renter is responsible for damage that occurs during the rental period not covered by insurance.</p>
      </Section>
      <Section title="Mileage">
        <p>Standard rentals include reasonable mileage. For unlimited or extended mileage packages, please select the corresponding add-on during booking. Excess mileage is charged at GH₵2 per kilometer.</p>
      </Section>
      <Section title="Insurance">
        <p>All vehicles include third-party liability insurance. Collision Damage Waiver (CDW) is available as an optional add-on. Without CDW, the renter is liable for damage up to the value of the security deposit.</p>
      </Section>
      <Section title="Breakdown & Accidents">
        <p>In the event of a breakdown or accident, contact our 24/7 emergency line immediately. Do not attempt repairs without authorization. We will arrange assistance or a replacement vehicle where possible.</p>
      </Section>
      <Section title="Traffic Violations">
        <p>The renter is solely responsible for all traffic violations, fines, and penalties incurred during the rental period. An administration fee of GH₵50 applies per violation we process on your behalf.</p>
      </Section>
      <Section title="Vehicle Return">
        <p>Return the vehicle to the agreed location on the agreed date and time. Vehicles returned more than 30 minutes late will be charged an additional day's rental rate. The vehicle must be returned clean with a full tank of fuel.</p>
      </Section>
    </LegalPage>
  )
}
