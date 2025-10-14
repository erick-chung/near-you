import SearchForm from "@/components/SearchForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchForm />
        </div>
      </div>
    </main>
  );
}
