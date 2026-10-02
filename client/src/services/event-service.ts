import { INITIAL_MOCK_CONCERTS } from '../mocks/concerts.mock'
import type { Concert } from '../types/concert'

const TM_API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY

export function getRecommendedEvents(): Concert[] {
  return INITIAL_MOCK_CONCERTS
}

export async function searchEvents(query: string): Promise<Concert[]> {
  if (!query.trim()) return []

  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(
        query
      )}&classificationName=music&size=12&apikey=${TM_API_KEY}`
    )

    if (!response.ok) throw new Error('Error en Ticketmaster')

    const data = await response.json()
    const rawEvents = data._embedded?.events || []

    return rawEvents.map((event: any): Concert => {
      return {
        id: event.id,
        title: event.name,
        artist: event._embedded?.attractions?.[0]?.name || event.name,
        date: event.dates?.start?.localDate || 'Por confirmar',
        venue: event._embedded?.venues?.[0]?.name || 'Ubicación no especificada',
        city: event._embedded?.venues?.[0]?.city?.name || event.place?.city?.name || 'Ciudad no especificada',
      }
    })
  } catch (error) {
    console.error('Error al consultar eventos:', error)
    return []
  }
}
