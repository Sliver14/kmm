async function testApis() {
  const [cats, acts, rels] = await Promise.all([
    fetch('http://localhost:3000/api/categories').then(r => r.json()),
    fetch('http://localhost:3000/api/activities').then(r => r.json()),
    fetch('http://localhost:3000/api/relationships').then(r => r.json()),
  ]);

  console.log('Categories API:', { count: cats.categories?.length, subCount: cats.subcategories?.length });
  console.log('Activities API:', { count: acts.activities?.length });
  console.log('Relationships API:', { count: rels.relationships?.length });
}

testApis().catch(console.error);
