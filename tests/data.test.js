import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {koreaDate,todayIndex} from '../src/utils/dates.js';
import {maps} from '../src/utils/maps.js';
import {visits,hasCoordinates,dayColors} from '../src/utils/journey.js';
const read=n=>JSON.parse(fs.readFileSync('public/data/'+n+'.json','utf8'));
const days=read('itinerary'),restaurants=read('restaurants'),places=read('places'),groups=read('restaurant-groups'),data={days,restaurants,places,groups};
const baseline=JSON.parse(fs.readFileSync('tests/fixtures/v36-itinerary.json','utf8')),oldGroups=JSON.parse(fs.readFileSync('tests/fixtures/v36-groups.json','utf8'));
test('V3.6 dates, order, time slots and all original activity fields are preserved',()=>{
 for(let i=0;i<5;i++){assert.equal(days[i].date,baseline[i].date);const original=days[i].activities.filter(a=>a.id!=='day1-exchange');assert.deepEqual(original.map(a=>a.id),baseline[i].activities.map(a=>a.id));for(let j=0;j<original.length;j++){const copy={...original[j]};delete copy.routePlaceIds;delete copy.transitGuide;assert.deepEqual(copy,baseline[i].activities[j]);}}
 assert.deepEqual(days.map(d=>d.activities.length),[9,11,8,12,7]);
});
test('all restaurant roles preserved; youth intestines is fourth backup only',()=>{
 for(const [id,group] of Object.entries(oldGroups))assert.deepEqual(groups[id].filter(g=>g.restaurantId!=='youth-intestines'),group);
 assert.deepEqual(groups['d4-lunch'][4],{restaurantId:'youth-intestines',role:'alternative'});
 assert.equal(groups['d4-lunch'][0].role,'preferred');
});
test('exchange candidates limited to two and remain flexible',()=>{
 const a=days[0].activities.find(a=>a.id==='day1-exchange');
 assert.deepEqual(a.candidatePlaceIds,['money-box','money-planet']);assert.equal(a.startTime,null);assert.equal(a.timeStatus,'flexible');
 assert.deepEqual(places.filter(p=>p.placeType==='exchange').map(p=>p.id),a.candidatePlaceIds);
});
test('references, source-backed coordinates and safe search links',()=>{
 const ids=new Set([...places,...restaurants].map(p=>p.id));assert.equal(ids.size,places.length+restaurants.length);
 for(const d of days)for(const a of d.activities){for(const id of [a.placeId,...a.routePlaceIds||[],...a.candidatePlaceIds||[]].filter(Boolean))assert.ok(ids.has(id));if(a.restaurantGroupId)assert.ok(groups[a.restaurantGroupId]);}
 for(const group of Object.values(groups))for(const g of group)assert.ok(restaurants.some(r=>r.id===g.restaurantId));
 for(const p of [...places,...restaurants]){if(p.latitude!=null||p.longitude!=null){assert.ok(hasCoordinates(p));assert.ok(p.latitude>34&&p.latitude<36);assert.ok(p.longitude>128&&p.longitude<130);assert.equal(new URL(p.coordinateSource).protocol,'https:');}for(const u of [maps(p).google,maps(p).naver,p.instagramUrl,p.bookingUrl].filter(Boolean))assert.equal(new URL(u).protocol,'https:');}
 for(const id of ['money-planet','youth-intestines'])assert.equal(hasCoordinates([...places,...restaurants].find(p=>p.id===id)),false);
 const unknown={nameZh:'待確認店',latitude:35,longitude:129,address:'猜測地址',verificationStatus:'unverified'};assert.ok(maps(unknown).google.includes(encodeURIComponent('待確認店')));
});
test('map filtering and cross-day visits retain every occurrence',()=>{
 const all=visits(data);assert.ok(all.some(v=>v.day===1&&v.id==='airport'));assert.ok(all.some(v=>v.day===5&&v.id==='airport'));
 for(let d=1;d<=5;d++)assert.ok(visits(data,d).every(v=>v.day===d));
 assert.equal(visits(data,1).filter(v=>v.place.placeType==='exchange').length,2);
 assert.equal(visits(data,4).find(v=>v.id==='youth-intestines').role,'alternative');
 assert.deepEqual(dayColors,['#E99B75','#3E91CE','#40A48B','#9675D1','#D3A43F']);
});
test('subway itinerary retains transport option and unconfirmed accommodation',()=>{
 const a=days[0].activities.find(a=>a.id==='day1-4');assert.equal(a.transport.mode,'大型計程車');assert.deepEqual(a.routePlaceIds,['airport-station','sasang-station','haeundae-station']);assert.ok(a.transitGuide.steps.join('').includes('장산'));assert.ok(a.transitGuide.fare.includes('2027'));
});
test('Korea date boundaries',()=>{assert.equal(koreaDate(new Date('2027-03-09T15:00:00Z')),'2027-03-10');assert.equal(todayIndex(days,new Date('2027-03-13T15:00:00Z')),4);assert.equal(todayIndex(days,new Date('2027-03-14T15:00:00Z')),-1);});
