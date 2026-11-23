export const editorialTerritories = [
  { slug:'residence', title:'The Residence', navTitle:'Residence', intro:'Interiors, architecture, furniture, materials and transformations that make a home feel unmistakably considered.', focus:['Exceptional interiors and architecture','Furniture, layouts and room planning','Materials, finishes and craftsmanship','Renovations and thoughtful transformations'], line:'Spaces with a point of view.' },
  { slug:'experience', title:'The Experience', navTitle:'Experience', intro:'The considered technology and atmosphere that shape how a home sounds, feels and works.', focus:['Home cinema and private viewing','Audio, speakers and listening spaces','Smart lighting and home automation','Connected comfort and considered technology'], line:'Technology, made part of living.' },
  { slug:'objects', title:'The Objects', navTitle:'Objects', intro:'Furniture, lighting, tableware, art and design objects selected for their character, material quality and place in a room.', focus:['Furniture and collectible design','Lighting, sculpture and art','Tableware and objects for hosting','Materials, makers and enduring design'], line:'Objects worth living with.' },
  { slug:'ritual', title:'The Ritual', navTitle:'Ritual', intro:'The everyday moments and personal routines that make a home more than a collection of rooms.', focus:['Coffee, dining and hosting','Reading corners and quiet spaces','Bedroom, bath and evening rituals','Small details that shape daily life'], line:'The art of everyday living.' },
  { slug:'address', title:'The Address', navTitle:'Address', intro:'Memorable homes, architecture, hospitality and destinations — and the ideas they offer for living well.', focus:['Exceptional homes and properties','Residential architecture and place','Hotels and hospitality interiors','Indoor–outdoor living and destination design'], line:'Places worth remembering.' }
] as const;

export const roomCategories = [
  { slug:'kitchen', title:'Kitchen', intro:'From the first cup of coffee to the last thing put away, make the kitchen easier to move through.', focus:['Cabinet and cupboard organization','Pantry and food storage','Countertop solutions','Small-kitchen planning'] },
  { slug:'bathroom', title:'Bathroom', intro:"Make the morning and evening routines feel less crowded, with storage that respects the room's plumbing and moisture.", focus:['Vanity and basin storage','Shower and bath organization','No-drill storage ideas','Compact bathroom planning'] },
  { slug:'bedroom', title:'Bedroom', intro:'Make the end of the day feel more restful with useful storage and considered everyday details.', focus:['Bedside essentials','Bedroom storage','Bedding and textiles','Calm, uncluttered spaces'] },
  { slug:'closet', title:'Closet', intro:'Find what you need on busy mornings, then make putting it away feel just as simple.', focus:['Wardrobe organization','Drawer and shelf systems','Accessories storage','Small closet solutions'] },
  { slug:'laundry', title:'Laundry', intro:'Make laundry day feel less like a pile-up, with a place for each step and the things it needs.', focus:['Laundry sorting','Utility-room storage','Drying and care','Compact laundry spaces'] },
  { slug:'small-spaces', title:'Small spaces', intro:'Give small rooms more breathing room without asking them to do more than they can.', focus:['Multi-purpose furniture','Vertical storage','Entryway solutions','Small-apartment planning'] },
  { slug:'the-edit', title:'The Trove Edit', intro:'A thoughtful edit of pieces that earn their space by making an everyday moment work better.', focus:['Everyday essentials','Smart storage','Materials and care','Worth-the-space comparisons'] }
] as const;

export const categories = [...editorialTerritories, ...roomCategories] as const;

export const articles = [
  { slug:'under-sink-storage', category:'Kitchen', title:'How to Think Through Under-Sink Storage', excerpt:'Measure around the plumbing, keep the shut-off valves reachable and choose storage that works with the space you actually have.', read:'9 min read', status:'Editorial guide' },
  { slug:'pantry-organization-system', category:'Kitchen', title:'A Pantry That Works: Building a Better Food Storage System', excerpt:'Build a pantry around visibility and rotation: audit what you own, group food by use and understand what date labels mean in your market.', read:'9 min read', status:'Editorial guide' },
  { slug:'small-bathroom-storage', category:'Bathroom', title:'Making a Small Bathroom Feel More Considered', excerpt:'A practical guide to small bathroom storage: moisture, vanity space, plumbing access, safe storage and the everyday routines that make a compact room work.', read:'8 min read', status:'Editorial guide' },
  { slug:'no-drill-storage', category:'Small spaces', title:'No-Drill Storage: What Works, What Can Damage Walls and What to Avoid', excerpt:'Compare adhesive, suction, tension and freestanding storage by surface, environment, load and the consequences if a fixing fails.', read:'9 min read', status:'Editorial guide' }
] as const;

// Only complete, owner-approved manuscripts are eligible for public journal, category and sitemap listings.
export const fullManuscriptSlugs = [
  'under-sink-storage',
  'pantry-organization-system',
  'small-bathroom-storage',
  'no-drill-storage',
] as const;
