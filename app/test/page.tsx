import { geocodeAddress } from "@/lib/actions/geocoding.action";

async function TestPage() {
  try {
    const result = await geocodeAddress("asdfasdf");

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Geocoding Test</h1>
        <div className="bg-green-100 p-4 rounded">
          <p>
            <strong>Success!</strong>
          </p>
          <p>Formatted: {result.formatted}</p>
          <p>Lat: {result.coordinates.lat}</p>
          <p>Lng: {result.coordinates.lng}</p>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Geocoding Test</h1>
        <div className="bg-red-100 p-4 rounded">
          <p>
            <strong>Error:</strong>
          </p>
          <p>{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      </div>
    );
  }
}

export default TestPage;
