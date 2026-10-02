const TM_API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;

export async function searchEvents(query: string) {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(query)}&classificationName=music&apikey=${TM_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Error de Ticketmaster: ${response.status}`);
    }

    const data = await response.json();
    
    return data._embedded?.events || [];
  } catch (error) {
    console.error('Error al consultar la API de Ticketmaster:', error);
    return [];
  }
}