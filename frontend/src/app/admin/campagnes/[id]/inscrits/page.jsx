export default async function AdminCampagneInscritsPage({ params }) {
  const { id } = await params;
  return (
    <div>
      <h1>Gestion des inscrits - Campagne {id}</h1>
    </div>
  );
}
