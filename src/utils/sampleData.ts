import { Song, Playlist } from '../types/music';

// Procedural SVG artwork generator matching the dark, cinematic, and silver aesthetic
const makeCover = (
  gradientFrom: string,
  gradientTo: string,
  accent: string,
  symbolType: 'crown' | 'waves' | 'star' | 'circle' | 'soundwave' | 'flame' | 'grid' | 'skull' | 'headphones'
) => {
  let innerGraphic = '';
  if (symbolType === 'crown') {
    // Regal crown as featured in The Weeknd / Blinding Lights artwork in reference
    innerGraphic = `
      <path d="M70 200 L90 120 L130 160 L150 90 L170 160 L210 120 L230 200 Z" fill="none" stroke="${accent}" stroke-width="4.5" stroke-linejoin="round" opacity="0.95"/>
      <circle cx="150" cy="80" r="8" fill="#ffffff"/>
      <circle cx="90" cy="110" r="6" fill="${accent}"/>
      <circle cx="210" cy="110" r="6" fill="${accent}"/>
      <rect x="70" y="200" width="160" height="12" rx="4" fill="${accent}" opacity="0.8"/>
    `;
  } else if (symbolType === 'star') {
    // Starboy cross/star emblem
    innerGraphic = `
      <polygon points="150,60 175,120 240,125 190,170 205,235 150,195 95,235 110,170 60,125 125,120" fill="none" stroke="${accent}" stroke-width="4" opacity="0.9"/>
      <circle cx="150" cy="150" r="28" fill="${accent}" opacity="0.3"/>
      <circle cx="150" cy="150" r="8" fill="#ffffff"/>
    `;
  } else if (symbolType === 'soundwave') {
    // Arctic Monkeys AM style audio waveform
    innerGraphic = `
      <path d="M40 150 Q70 100 95 150 T150 150 T205 150 T260 150" fill="none" stroke="${accent}" stroke-width="6" opacity="0.9"/>
      <path d="M40 150 Q70 60 95 150 T150 150 T205 150 T260 150" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.7"/>
      <circle cx="150" cy="150" r="42" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="6,4"/>
    `;
  } else if (symbolType === 'flame') {
    // ASTROWORLD flame / theme park
    innerGraphic = `
      <path d="M150 70 C165 110 200 135 185 175 C175 200 155 220 150 230 C145 220 125 200 115 175 C100 135 135 110 150 70 Z" fill="none" stroke="${accent}" stroke-width="5" opacity="0.9"/>
      <path d="M150 120 C160 145 175 160 170 185 C165 200 155 210 150 215 C145 210 135 200 130 185 C125 160 140 145 150 120 Z" fill="${accent}" opacity="0.4"/>
      <circle cx="150" cy="185" r="10" fill="#ffffff"/>
    `;
  } else if (symbolType === 'skull') {
    // Hollywood's Bleeding Post Malone emblem
    innerGraphic = `
      <circle cx="150" cy="140" r="55" fill="none" stroke="${accent}" stroke-width="4.5" opacity="0.9"/>
      <rect x="130" y="185" width="40" height="25" rx="6" fill="none" stroke="${accent}" stroke-width="4"/>
      <circle cx="130" cy="140" r="12" fill="#ffffff" opacity="0.85"/>
      <circle cx="170" cy="140" r="12" fill="#ffffff" opacity="0.85"/>
      <path d="M150 155 L150 170" stroke="${accent}" stroke-width="3"/>
    `;
  } else if (symbolType === 'headphones') {
    innerGraphic = `
      <path d="M80 160 A70 70 0 0 1 220 160" fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
      <rect x="70" y="150" width="22" height="45" rx="10" fill="${accent}"/>
      <rect x="208" y="150" width="22" height="45" rx="10" fill="${accent}"/>
      <circle cx="150" cy="150" r="24" fill="none" stroke="#ffffff" stroke-width="3"/>
    `;
  } else if (symbolType === 'waves') {
    innerGraphic = `
      <path d="M 40 180 Q 95 130 150 180 T 260 180" fill="none" stroke="${accent}" stroke-width="6" opacity="0.9"/>
      <path d="M 40 150 Q 95 100 150 150 T 260 150" fill="none" stroke="#fff" stroke-width="3" opacity="0.7"/>
      <path d="M 40 120 Q 95 70 150 120 T 260 120" fill="none" stroke="${accent}" stroke-width="4" opacity="0.5"/>
    `;
  } else {
    // circle / grid
    innerGraphic = `
      <circle cx="150" cy="150" r="68" fill="none" stroke="${accent}" stroke-width="4" opacity="0.85"/>
      <circle cx="150" cy="150" r="42" fill="${accent}" opacity="0.25"/>
      <circle cx="150" cy="150" r="14" fill="#ffffff"/>
      <circle cx="150" cy="150" r="85" fill="none" stroke="rgba(255,255,255,0.2)" stroke-dasharray="4,4"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradientFrom}"/>
        <stop offset="100%" stop-color="${gradientTo}"/>
      </linearGradient>
      <radialGradient id="specularRim" cx="50%" cy="20%" r="70%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.25)"/>
        <stop offset="50%" stop-color="rgba(255,255,255,0.02)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.6)"/>
      </radialGradient>
      <filter id="cinematicGrain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0"/>
      </filter>
    </defs>
    <rect width="300" height="300" fill="url(#bgGrad)"/>
    <rect width="300" height="300" fill="url(#specularRim)"/>
    <rect width="300" height="300" filter="url(#cinematicGrain)"/>
    ${innerGraphic}
    <rect x="8" y="8" width="284" height="284" rx="24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.3"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const INITIAL_SAMPLE_SONGS: Song[] = [
  {
    id: 'track-1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200, // 3:20
    coverUrl: makeCover('#050505', '#1a0b12', '#CBD5E1', 'crown'),
    genre: 'Synthpop',
    year: 2020,
    isFavorite: true,
    isSample: true,
    dominantColor: '#CBD5E1',
    secondaryColor: '#0F172A',
    bpm: 171,
    melodyKey: 'F_MINOR',
    filePath: '/storage/emulated/0/Music/The_Weeknd/Blinding_Lights.flac',
    lyrics: [
      { time: 0, text: '• Cinematic 80s Synthesizer Intro •' },
      { time: 14, text: "Yeah, I've been tryna call" },
      { time: 21, text: "I've been on my own for long enough" },
      { time: 29, text: "Maybe you can show me how to love, maybe" },
      { time: 38, text: "I'm going through withdrawals" },
      { time: 45, text: "You don't even have to do too much" },
      { time: 52, text: "You can turn me on with just a touch, baby" },
      { time: 60, text: "• Synthesizer Hook Pulse •" },
      { time: 68, text: "I look around and Sin City's cold and empty" },
      { time: 76, text: "No one's around to judge me" },
      { time: 83, text: "I can't see clearly when you're gone" },
      { time: 91, text: "I said, ooh, I'm blinded by the lights" },
      { time: 106, text: "No, I can't sleep until I feel your touch" },
      { time: 120, text: "I said, ooh, I'm drowning in the night" },
      { time: 135, text: "Oh, when I'm like this, you're the one I trust" },
      { time: 150, text: "• Dynamic Guitar & Synth Solo •" },
      { time: 175, text: "I'm just walking by to let you know" },
      { time: 190, text: "I can never say it on the phone" },
    ],
  },
  {
    id: 'track-2',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 215, // 3:35
    coverUrl: makeCover('#08080c', '#151b28', '#E2E8F0', 'crown'),
    genre: 'Synthpop',
    year: 2020,
    isFavorite: true,
    isSample: true,
    dominantColor: '#E2E8F0',
    secondaryColor: '#1E293B',
    bpm: 118,
    melodyKey: 'C_MAJOR',
    filePath: '/storage/emulated/0/Music/The_Weeknd/Save_Your_Tears.flac',
    lyrics: [
      { time: 0, text: '• Bright Electro Synth Melody •' },
      { time: 12, text: "I saw you dancing in a crowded room" },
      { time: 24, text: "You look so happy when I'm not with you" },
      { time: 36, text: "But then you saw me, caught you by surprise" },
      { time: 48, text: "A single teardrop falling from your eye" },
      { time: 60, text: "Save your tears for another day" },
      { time: 90, text: '• Liquid Bassline Groove •' },
      { time: 120, text: "I realize that I'm much too late" },
      { time: 150, text: "And you deserve someone better" },
    ],
  },
  {
    id: 'track-3',
    title: 'Starboy',
    artist: 'The Weeknd',
    album: 'Starboy',
    duration: 230, // 3:50
    coverUrl: makeCover('#050505', '#1e1124', '#CBD5E1', 'star'),
    genre: 'R&B / Pop',
    year: 2016,
    isFavorite: true,
    isSample: true,
    dominantColor: '#CBD5E1',
    secondaryColor: '#334155',
    bpm: 93,
    melodyKey: 'G_MINOR',
    filePath: '/storage/emulated/0/Music/The_Weeknd/Starboy.mp3',
    lyrics: [
      { time: 0, text: '• Daft Punk Vocoder & Piano •' },
      { time: 16, text: "I'm tryna put you in the worst mood, ah" },
      { time: 32, text: "P1 cleaner than your church shoes, ah" },
      { time: 48, text: "Milli point two just to hurt you, ah" },
      { time: 64, text: "Look what you've done, I'm a motherfuckin' starboy" },
    ],
  },
  {
    id: 'track-4',
    title: 'SICKO MODE',
    artist: 'Travis Scott',
    album: 'ASTROWORLD',
    duration: 312, // 5:12
    coverUrl: makeCover('#07090e', '#1c1f2e', '#94A3B8', 'flame'),
    genre: 'Hip-Hop / Trap',
    year: 2018,
    isFavorite: true,
    isSample: true,
    dominantColor: '#94A3B8',
    secondaryColor: '#0F172A',
    bpm: 155,
    melodyKey: 'Bb_MINOR',
    filePath: '/storage/emulated/0/Music/Travis_Scott/SICKO_MODE.flac',
    lyrics: [
      { time: 0, text: '• Astro Horns & Beat Switch Intro •' },
      { time: 24, text: "Sun is down, freezin' cold" },
      { time: 42, text: "That's how we already know winter's here" },
      { time: 60, text: "• High Octane 808 Trap Drop •" },
      { time: 90, text: "Made this here with all the ice on in the booth" },
    ],
  },
  {
    id: 'track-5',
    title: 'Die For You',
    artist: 'The Weeknd',
    album: 'Starboy',
    duration: 260, // 4:20
    coverUrl: makeCover('#040507', '#111420', '#E2E8F0', 'star'),
    genre: 'R&B',
    year: 2016,
    isFavorite: false,
    isSample: true,
    dominantColor: '#E2E8F0',
    secondaryColor: '#1E293B',
    bpm: 67,
    melodyKey: 'C#_MINOR',
    filePath: '/storage/emulated/0/Music/The_Weeknd/Die_For_You.mp3',
    lyrics: [
      { time: 0, text: '• Slow Atmospheric Chords •' },
      { time: 18, text: "I'm findin' ways to articulate the feelin' I'm goin' through" },
      { time: 40, text: "I just can't say I don't love you, 'cause I love you" },
      { time: 65, text: "Even though we're goin' through it, and it makes you feel alone" },
    ],
  },
  {
    id: 'track-6',
    title: 'I Feel It Coming',
    artist: 'The Weeknd',
    album: 'Starboy',
    duration: 269, // 4:29
    coverUrl: makeCover('#06070a', '#141824', '#CBD5E1', 'star'),
    genre: 'Disco / Pop',
    year: 2016,
    isFavorite: true,
    isSample: true,
    dominantColor: '#CBD5E1',
    secondaryColor: '#1E293B',
    bpm: 93,
    melodyKey: 'Ab_MAJOR',
    filePath: '/storage/emulated/0/Music/The_Weeknd/I_Feel_It_Coming.flac',
    lyrics: [
      { time: 0, text: '• Daft Punk Funk Guitar Chords •' },
      { time: 20, text: "Tell me what you really like, baby I can take my time" },
      { time: 45, text: "We don't have to rush when alone, baby" },
      { time: 70, text: "I feel it coming, I feel it coming, babe" },
    ],
  },
  {
    id: 'track-7',
    title: 'Better Now',
    artist: 'Post Malone',
    album: "Hollywood's Bleeding",
    duration: 231, // 3:51
    coverUrl: makeCover('#090a0d', '#20222a', '#FFFFFF', 'skull'),
    genre: 'Pop Rap',
    year: 2018,
    isFavorite: true,
    isSample: true,
    dominantColor: '#FFFFFF',
    secondaryColor: '#334155',
    bpm: 145,
    melodyKey: 'Bb_MAJOR',
    filePath: '/storage/emulated/0/Music/Post_Malone/Better_Now.mp3',
    lyrics: [
      { time: 0, text: '• Vocal Echo & Trap Snare •' },
      { time: 14, text: "You probably think that you are better now, better now" },
      { time: 30, text: "You only say that 'cause I'm not around, not around" },
      { time: 50, text: "You know I never meant to let you down, let you down" },
    ],
  },
  {
    id: 'track-8',
    title: 'Goosebumps',
    artist: 'Travis Scott',
    album: 'ASTROWORLD',
    duration: 243, // 4:03
    coverUrl: makeCover('#040507', '#161922', '#CBD5E1', 'flame'),
    genre: 'Trap',
    year: 2016,
    isFavorite: false,
    isSample: true,
    dominantColor: '#CBD5E1',
    secondaryColor: '#0F172A',
    bpm: 130,
    melodyKey: 'C_MINOR',
    filePath: '/storage/emulated/0/Music/Travis_Scott/Goosebumps.flac',
    lyrics: [
      { time: 0, text: '• Hypnotic 808 Bass Slide •' },
      { time: 18, text: "I get those goosebumps every time, yeah, you come around" },
      { time: 42, text: "Yeah, you ease my mind, you make everything feel fine" },
    ],
  },
  {
    id: 'track-9',
    title: "Creepin'",
    artist: 'The Weeknd, Metro Boomin',
    album: 'After Hours',
    duration: 221, // 3:41
    coverUrl: makeCover('#030305', '#12141c', '#E2E8F0', 'crown'),
    genre: 'R&B / Trap',
    year: 2022,
    isFavorite: true,
    isSample: true,
    dominantColor: '#E2E8F0',
    secondaryColor: '#1E293B',
    bpm: 98,
    melodyKey: 'C#_MINOR',
    filePath: '/storage/emulated/0/Music/The_Weeknd/Creepin.mp3',
    lyrics: [
      { time: 0, text: '• Rain SFX & Acoustic Guitar Pluck •' },
      { time: 18, text: "Somebody said they saw you" },
      { time: 36, text: "The person you were kissing wasn't me" },
      { time: 54, text: "I don't wanna know, if you're playin' me, keep it on the low" },
    ],
  },
  {
    id: 'track-10',
    title: 'Sweater Weather',
    artist: 'The Neighbourhood',
    album: 'I Love You.',
    duration: 240, // 4:00
    coverUrl: makeCover('#050608', '#181b24', '#CBD5E1', 'soundwave'),
    genre: 'Indie Rock',
    year: 2013,
    isFavorite: true,
    isSample: true,
    dominantColor: '#CBD5E1',
    secondaryColor: '#334155',
    bpm: 118,
    melodyKey: 'C_MAJOR',
    filePath: '/storage/emulated/0/Music/The_Neighbourhood/Sweater_Weather.mp3',
    lyrics: [
      { time: 0, text: '• Reverb Guitar & Shaker Rhythm •' },
      { time: 16, text: "All I am is a man, I want the world in my hands" },
      { time: 34, text: "I hate the beach but I stand in California with my toes in the sand" },
      { time: 56, text: "'Cause it's too cold for you here" },
      { time: 74, text: "And now, so let me hold both your hands in the holes of my sweater" },
    ],
  },
  {
    id: 'track-11',
    title: 'Do I Wanna Know?',
    artist: 'Arctic Monkeys',
    album: 'AM',
    duration: 272, // 4:32
    coverUrl: makeCover('#020203', '#111318', '#FFFFFF', 'soundwave'),
    genre: 'Indie Rock',
    year: 2013,
    isFavorite: true,
    isSample: true,
    dominantColor: '#FFFFFF',
    secondaryColor: '#1E293B',
    bpm: 85,
    melodyKey: 'G_MINOR',
    filePath: '/storage/emulated/0/Music/Arctic_Monkeys/Do_I_Wanna_Know.flac',
    lyrics: [
      { time: 0, text: '• Iconic Stomp & Riff Kick •' },
      { time: 22, text: "Have you got colour in your cheeks?" },
      { time: 42, text: "Do you ever get that fear that you can't shift the tide?" },
      { time: 64, text: "Crawlin' back to you" },
      { time: 86, text: "Ever thought of callin' when you've had a few?" },
      { time: 110, text: "'Cause I always do" },
    ],
  },
  {
    id: 'track-12',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 233, // 3:53
    coverUrl: makeCover('#06080c', '#131924', '#CBD5E1', 'circle'),
    genre: 'Pop',
    year: 2017,
    isFavorite: false,
    isSample: true,
    dominantColor: '#CBD5E1',
    secondaryColor: '#1E293B',
    bpm: 96,
    melodyKey: 'C#_MINOR',
    filePath: '/storage/emulated/0/Music/Ed_Sheeran/Shape_Of_You.mp3',
    lyrics: [
      { time: 0, text: '• Marimba Rhythm Intro •' },
      { time: 12, text: "The club isn't the best place to find a lover" },
      { time: 24, text: "So the bar is where I go" },
      { time: 38, text: "Me and my friends at the table doin' shots" },
      { time: 54, text: "Girl, you know I want your love" },
      { time: 70, text: "I'm in love with the shape of you" },
    ],
  },
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-favs',
    title: 'Favorites',
    description: 'Your favorite tracks in one fluid silver glass collection',
    coverGradient: ['#E2E8F0', '#0F172A'],
    songIds: ['track-1', 'track-2', 'track-3', 'track-4', 'track-6', 'track-7', 'track-10', 'track-11'],
    createdAt: '2026-01-10',
    isSystem: true,
  },
  {
    id: 'pl-my',
    title: 'My Playlist',
    description: 'Personal handpicked tracks for all moods',
    coverGradient: ['#CBD5E1', '#1E293B'],
    songIds: ['track-1', 'track-2', 'track-3', 'track-4', 'track-7'],
    createdAt: '2026-02-14',
  },
  {
    id: 'pl-chill',
    title: 'Chill Vibes',
    description: 'Mellow melodies, synthpop and ambient soundscapes',
    coverGradient: ['#94A3B8', '#020617'],
    songIds: ['track-2', 'track-6', 'track-10'],
    createdAt: '2026-03-01',
  },
  {
    id: 'pl-workout',
    title: 'Workout',
    description: 'High energy trap, hip-hop and driving basslines',
    coverGradient: ['#FFFFFF', '#334155'],
    songIds: ['track-1', 'track-4', 'track-8'],
    createdAt: '2026-03-12',
  },
  {
    id: 'pl-focus',
    title: 'Focus',
    description: 'Instrumentals and immersive soundscapes for deep work',
    coverGradient: ['#64748B', '#0A0C10'],
    songIds: ['track-3', 'track-5', 'track-9'],
    createdAt: '2026-03-18',
  },
  {
    id: 'pl-rock',
    title: 'Rock',
    description: 'Heavy riffs, indie anthems and energetic drums',
    coverGradient: ['#E2E8F0', '#111827'],
    songIds: ['track-10', 'track-11'],
    createdAt: '2026-03-22',
  },
  {
    id: 'pl-sad',
    title: 'Sad Songs',
    description: 'Heartbreak ballads, late night echoes and slow keys',
    coverGradient: ['#94A3B8', '#000000'],
    songIds: ['track-2', 'track-5', 'track-9'],
    createdAt: '2026-03-25',
  },
];
