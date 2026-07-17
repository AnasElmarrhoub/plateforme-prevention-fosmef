export default async function CampagneDetailPage({ params }) {
  const { id } = await params;
  return (
    <div>
      <h1>Détail de la campagne {id}</h1>
    </div>
  );
}
