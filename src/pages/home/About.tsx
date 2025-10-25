export default function AboutPage() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="screen max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">
            About Montalban Municipality
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn more about the municipality, its people, and the Sangguniang
            Bayan that serves the community.
          </p>
        </header>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-white rounded-xl shadow space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Our Mission
            </h2>
            <p className="text-gray-700">
              To provide quality public service, promote sustainable
              development, and empower the citizens of Montalban.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Our Vision</h2>
            <p className="text-gray-700">
              A progressive, inclusive, and sustainable municipality where every
              citizen thrives and participates in governance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
