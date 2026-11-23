insert into public.categories (slug,name,description,sort_order) values
('kitchen','Kitchen','Thoughtful ideas for kitchens, cabinets and pantry spaces.',1),
('bathroom','Bathroom','Practical storage and considered details for bathrooms.',2),
('bedroom','Bedroom','Calmer bedroom routines, storage and everyday essentials.',3),
('closet','Closet & Wardrobe','Wardrobe systems and storage that make getting ready easier.',4),
('laundry','Laundry','Useful ideas for laundry rooms and everyday care.',5),
('small-spaces','Small Spaces','Clever ways to make compact homes work harder.',6),
('living-room','Living Room','Comfortable, considered living spaces and useful essentials.',7),
('home-office','Home Office','Functional, focused spaces for working at home.',8),
('the-edit','The Trove Edit','A considered selection of useful home essentials.',9)
on conflict (slug) do update set name=excluded.name, description=excluded.description, sort_order=excluded.sort_order;
