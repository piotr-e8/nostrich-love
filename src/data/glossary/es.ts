// Glosario en español. Terminología alineada con las guías es/:
// relay/relays, clave pública/privada, cliente, evento, kind, feed, nota,
// hilo, lista de seguidos, mención, reacción, zap, Lightning Address,
// resistencia a la censura.
import type { GlossaryData, GlossaryMeta } from './index';

export const meta: GlossaryMeta = {
  seoTitle: 'Glosario de Nostr: npub, nsec, relays explicados',
  description:
    'Glosario completo de términos y conceptos de Nostr. Entiende la terminología clave: npub, nsec, relays, NIPs, zaps y mucho más.',
};

const es: GlossaryData = {
  nostr: {
    term: 'Nostr',
    definition:
      'Notes and Other Stuff Transmitted by Relays (notas y otras cosas transmitidas por relays). Un protocolo descentralizado para redes sociales y otras aplicaciones.',
  },
  npub: {
    term: 'npub',
    definition:
      'Tu clave pública (identificador público) en Nostr. Puedes compartirla con cualquiera sin riesgo. Tiene este aspecto: npub1...',
  },
  nsec: {
    term: 'nsec',
    definition:
      'Tu clave privada (clave secreta) en Nostr. ¡Nunca la compartas con nadie! Tiene este aspecto: nsec1...',
  },
  relay: {
    term: 'Relay',
    definition:
      'Un servidor que almacena y reenvía eventos de Nostr. Los usuarios se conectan a los relays para publicar y recibir contenido.',
  },
  client: {
    term: 'Cliente',
    definition:
      'Una aplicación que se conecta a los relays de Nostr y te permite leer y publicar notas. Ejemplos: Damus, Iris, Amethyst.',
  },
  nip: {
    term: 'NIP',
    definition:
      'Nostr Implementation Possibility. Un documento que describe cómo implementar funciones concretas de Nostr. NIP-01 es el protocolo básico.',
  },
  zap: {
    term: 'Zap',
    definition:
      'Un pago por la red Lightning de Bitcoin enviado a través de Nostr. Se usa para dar propinas o apoyar a otros usuarios.',
  },
  nip05: {
    term: 'NIP-05',
    definition:
      'Un estándar de identificadores legibles por humanos (como usuario@dominio.com) vinculados a claves públicas de Nostr.',
  },
  event: {
    term: 'Evento',
    definition:
      'La unidad básica de datos en Nostr. Puede ser una nota (publicación), metadatos, una lista de contactos, una reacción u otros tipos.',
  },
  kind: {
    term: 'Kind',
    definition:
      'Un número que indica el tipo de un evento. Kind 1 es una nota de texto (publicación normal), Kind 0 son metadatos, etc.',
  },
  pubkey: {
    term: 'Pubkey',
    definition:
      'Abreviatura de public key (clave pública). Tu identificador en la red Nostr, derivado de tu clave privada.',
  },
  'nsec-format': {
    term: '_nsec',
    definition:
      'Formato de clave privada codificada en Bech32. Empieza por "nsec1" y debe mantenerse en secreto.',
  },
  'npub-format': {
    term: '_npub',
    definition:
      'Formato de clave pública codificada en Bech32. Empieza por "npub1" y puede compartirse públicamente sin riesgo.',
  },
  feed: {
    term: 'Feed',
    definition:
      'Un flujo cronológico de publicaciones de las cuentas que sigues, mostrado en tu cliente de Nostr.',
  },
  'follow-list': {
    term: 'Lista de seguidos',
    definition:
      'Una lista de las claves públicas que sigues, guardada como un evento especial (Kind 3) en los relays.',
  },
  'relay-list': {
    term: 'Lista de relays',
    definition:
      'Una lista de los relays que usas, guardada como un evento especial (Kind 10002 con NIP-65).',
  },
  dm: {
    term: 'DM',
    definition:
      'Mensaje directo (Direct Message). Mensajes privados cifrados entre usuarios de Nostr (NIP-04 o NIP-17).',
  },
  mention: {
    term: 'Mención',
    definition:
      'Referencia a otro usuario en una nota usando su npub o su identificador NIP-05.',
  },
  hashtag: {
    term: 'Hashtag',
    definition:
      'Temas o palabras clave precedidos de # para categorizar el contenido y hacerlo más fácil de descubrir.',
  },
  thread: {
    term: 'Hilo',
    definition:
      'Una serie de notas conectadas (respuestas) que forman una conversación.',
  },
  repost: {
    term: 'Boost / Repost',
    definition:
      'Compartir la nota de otra persona con tus seguidores (evento Kind 6).',
  },
  reaction: {
    term: 'Reacción',
    definition:
      'Una respuesta simple con un emoji a una nota (evento Kind 7). Normalmente un me gusta (❤️).',
  },
  lnurl: {
    term: 'LNURL',
    definition:
      'Lightning Network URL. Un estándar para interacciones de pago en la red Lightning.',
  },
  'lightning-address': {
    term: 'Lightning Address',
    definition:
      'Un identificador legible por humanos para recibir pagos Lightning (como nombre@dominio.com).',
  },
  'nostr-address': {
    term: 'Dirección Nostr',
    definition:
      'Un identificador NIP-05 con aspecto de dirección de correo (usuario@dominio.com) vinculado a tu npub.',
  },
  'censorship-resistance': {
    term: 'Resistencia a la censura',
    definition:
      'La capacidad de publicar contenido sin que una autoridad central pueda bloquearlo. Una característica esencial de Nostr.',
  },
};

export default es;
