import AddSession from "./add";

export default function SessionPage() {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <div>
            <h3 className="">Session Management</h3>
            <p>Manage session schedule.</p>
          </div>
        </div>

        <AddSession />
      </header>
    </section>
  );
}
