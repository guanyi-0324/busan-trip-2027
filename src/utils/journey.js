export const dayColors=['#E99B75','#3E91CE','#40A48B','#9675D1','#D3A43F'];
export const hasCoordinates=p=>Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&!!p.coordinateSource;
export function visits(data,day=0){
 const items=new Map([...data.places,...data.restaurants].map(p=>[p.id,p]));
 return data.days.filter(d=>!day||d.dayNumber===day).flatMap(d=>d.activities.flatMap(a=>[
 ...[a.placeId,...(a.routePlaceIds||[])].filter(Boolean).map(id=>({id,role:'scheduled'})),
 ...(a.candidatePlaceIds||[]).map(id=>({id,role:'equal'})),
 ...(data.groups[a.restaurantGroupId]||[]).map(g=>({id:g.restaurantId,role:g.role}))
 ].map(v=>({...v,place:items.get(v.id),day:d.dayNumber,date:d.date,activity:a})).filter(v=>v.place)));
}
export function duration(a){if(!a.startTime||!a.endTime)return '依現場安排';const minutes=t=>t.split(':').reduce((h,m)=>h*60+ +m);return (minutes(a.endTime)-minutes(a.startTime)+1440)%1440+' 分鐘（規劃）';}

