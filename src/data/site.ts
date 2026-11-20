export const categories = [
  { slug:'kitchen', title:'Kitchen', intro:'Thoughtful ways to make the hardest-working room in the home work better.', focus:['Cabinet and cupboard organization','Pantry and food storage','Countertop solutions','Small-kitchen planning'] },
  { slug:'bathroom', title:'Bathroom', intro:'Practical storage and considered details for a calmer daily routine.', focus:['Under-sink storage','Shower and bath organization','No-drill storage ideas','Compact bathroom planning'] },
  { slug:'bedroom', title:'Bedroom', intro:'Restful spaces shaped by useful storage and thoughtful everyday essentials.', focus:['Bedside essentials','Bedroom storage','Bedding and textiles','Calm, uncluttered spaces'] },
  { slug:'closet', title:'Closet', intro:'Make wardrobes and dressing spaces easier to use, one thoughtful system at a time.', focus:['Wardrobe organization','Drawer and shelf systems','Accessories storage','Small closet solutions'] },
  { slug:'laundry', title:'Laundry', intro:'Small systems and practical ideas that make the laundry routine feel simpler.', focus:['Laundry sorting','Utility-room storage','Drying and care','Compact laundry spaces'] },
  { slug:'small-spaces', title:'Small spaces', intro:'Make the most of the home you have with flexible, space-aware ideas.', focus:['Multi-purpose furniture','Vertical storage','Entryway solutions','Small-apartment planning'] },
  { slug:'the-edit', title:'The Trove Edit', intro:'A considered approach to useful, beautiful home essentials across different budgets.', focus:['Everyday essentials','Smart storage','Materials and care','Worth-the-space comparisons'] }
] as const;

export const articles = [
  { slug:'small-kitchen-planning', category:'Kitchen', title:'A more useful small kitchen starts with a plan', excerpt:'A practical framework for understanding your storage, workflow and everyday pinch points before buying another organizer.', read:'6 min read', status:'Editorial guide' },
  { slug:'under-sink-storage', category:'Bathroom', title:'How to think through under-sink storage', excerpt:'Measure around plumbing, group what you use and choose a system that makes the awkward space easier to reach.', read:'5 min read', status:'Editorial guide' },
  { slug:'closet-reset', category:'Closet', title:'A thoughtful wardrobe reset, one zone at a time', excerpt:'A manageable way to review hanging space, drawers, shelves and the items you reach for most.', read:'7 min read', status:'Editorial guide' }
] as const;
