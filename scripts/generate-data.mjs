import fs from 'node:fs';
const root='public/data';fs.mkdirSync(root,{recursive:true});
const write=(name,data)=>fs.writeFileSync(`${root}/${name}.json`,JSON.stringify(data,null,2)+'\n');
const source=fs.readFileSync(process.argv[2],'utf8');
const days=[...source.matchAll(/## Day (\d)｜([^\n]+)\n([\s\S]*?)(?=\n## Day |\n## 七、)/g)].map(m=>({date:`2027-03-${9+Number(m[1])}`,dayNumber:+m[1],title:m[2].split('：')[1].trim(),status:m[1]==='4'?'confirmed':'planned',activities:[...m[3].matchAll(/\| ([^|\n]+) \| ([^|\n]+) \|/g)].filter(r=>r[1]!=='時間').map((r,i)=>{let times=r[1].match(/\d{2}:\d{2}/g)||[];return {id:`day${m[1]}-${i+1}`,timeLabel:r[1],startTime:times[0]||null,endTime:times[1]||null,title:r[2],type:'activity',placeId:null,restaurantGroupId:null,notes:[],timeStatus:/暫定/.test(r[2])?'tentative':/約/.test(r[1])?'approximate':'planned',timezone:r[1].includes('台灣')?'Asia/Taipei':'Asia/Seoul',after:r[1].includes('後')};})}));
const restaurants=[];const groups={};
function group(id,area,rows){groups[id]=rows.map(([rid,zh,ko,cat,dishes,role='equal',budget=null,ig=null])=>{if(!restaurants.some(r=>r.id===rid))restaurants.push({id:rid,nameZh:zh,nameKo:ko,category:cat,area,description:`${area}用餐候選；營業狀況與分店待確認。`,recommendedDishes:dishes.split('、'),price:{amount:budget,currency:'KRW',unit:budget?'四人':'待確認',type:budget?'estimate':'unverified',note:budget?'預算估算，非 2027 年保證售價':cat==='螃蟹'?'依重量、季節與行情變動，現場詢價':'待確認'},address:null,latitude:null,longitude:null,googleMapsUrl:null,naverMapsUrl:null,instagramUrl:ig,instagramType:ig?'hashtag':'unverified',image:null,hours:null,verifiedAt:null,verificationStatus:'unverified',notes:[]});return {restaurantId:rid,role};});}
group('d1-dinner','海雲台',[
['gwang','光安木','광안목 해운대점','熟成豬肉','熟成五花肉、熟成豬頸肉、店員代烤','equal','₩95,000～125,000'],['matchan','味讚王鹽烤肉','맛찬들왕소금구이','熟成豬肉','厚切熟成豬肉、熟成五花肉、鹽烤料理','equal','₩100,000～140,000'],['soup-flex','海雲台豬肉湯飯',null,'豬肉湯飯','豬肉湯飯','emergency']]);
group('d2-lunch','機張', [['crab1','機張名品雪蟹','기장명품대게'],['crab2','青海王雪蟹','청해왕대게'],['crab3','機張小伙雪蟹','기장총각대게'],['crab4','機張雪蟹之家','기장대게하우스']].map(r=>[...r,'螃蟹','螃蟹','equal',null,`https://www.instagram.com/explore/tags/${encodeURIComponent(r[2])}/`]));
group('d2-dinner','海雲台 Marine City',[['chicken','海雲台一隻雞','해운대닭한마리 본점','一隻雞火鍋','一隻雞火鍋、韓式刀削麵、雞湯粥','preferred']]);
group('d3-lunch','札嘎其',[['stall183','183 號：총각상회','총각상회'],['stall218','218 號：신경북상회','신경북상회'],['stall376','376 號：영도상회 남포점','영도상회 남포점'],['stall154','154～155 號：탐라상회','탐라상회'],['stall373','373 號：동양상회','동양상회'],['stall1','1 號：대양상회','대양상회']].map(r=>[...r,'海鮮攤販','活魚生魚片、貝類、鮑魚、辣魚湯']));
for(const [id,url] of [['stall183','chong_gak_jagalchimarket'],['stall218','singyeongbugsanghoe']])Object.assign(restaurants.find(r=>r.id===id),{instagramUrl:`https://www.instagram.com/${url}/`,instagramType:'unverified'});
restaurants.filter(r=>r.id.startsWith('stall')).forEach(r=>r.notes.push('參考攤位，現場核實；一樓選海鮮，合作二樓餐廳料理。'));
group('d3-dinner','松島',[['baek','白松排骨','백송갈비','韓式烤肉','烤肉'],['uyeon','偶然地','우연지','高級韓牛','韓牛'],['hae','海日出馬鈴薯排骨湯','해오름감자탕','馬鈴薯排骨湯','馬鈴薯排骨湯'],['songam','松岩豬肉湯飯','송암돼지국밥','豬肉湯飯','豬肉湯飯']]);
group('d4-lunch','西面',[['gaemi','螞蟻家','개미집','章魚牛腸蝦鍋','章魚牛腸蝦鍋（낙곱새）','preferred'],['sinchon','新村韓式燉排骨','신촌양푼이갈비찜','燉排骨','韓式燉排骨','alternative'],['songjeong','松亭三代湯飯','송정3대국밥','湯飯','豬肉湯飯','alternative'],['milmyeon','西面小麥冷麵','서면밀면','冷麵','小麥冷麵','alternative']]);
group('d4-cafe','廣安里',[['haute','Cafe Haute','카페오뜨'],['cup','Cup & Cup','컵앤컵'],['working','Working Holiday','워킹홀리데이 광안']].map(r=>[...r,'海景咖啡廳','飲品待確認']));
group('d4-dinner','廣安里',[['1988','1988 釜山韓牛家',null,'韓牛','韓牛'],['better','更好的韓牛','더좋은한우','韓牛','韓牛'],['seok','石花宴','석화연','熟成豬肉','熟成豬肉'],['go','高下順','고하순','熟成豬肉','熟成豬肉']]);
group('d5-breakfast','海雲台',[['geodae','巨代牛肉湯','거대곰탕','牛肉湯','牛肉湯'],['soup-flex','海雲台豬肉湯飯',null,'豬肉湯飯','豬肉湯飯']]);
restaurants.find(r=>r.id==='soup-flex').notes.push('非指定店家；當天依營業狀況選擇。');
const places=[
['airport','金海國際機場','김해국제공항','機場','入境、行李領取及回程報到。',null,null],
['haeundae','海雲台海灘','해운대해수욕장','海雲台','海邊散步與夜景。',40,null],
['luge','Skyline Luge Busan','스카이라인루지 부산','機張','沿著斜坡滑行的戶外體驗。',90,'https://busan.skylineluge.kr/'],
['gijang','機張市場','기장시장','機張','四間螃蟹餐廳保留，當天現場詢價。',90,null],
['mipo','尾浦站','미포정거장','海雲台','散步、咖啡與膠囊搭乘準備。',105,'https://www.bluelinepark.com/'],
['sky-capsule','天空膠囊','해운대 스카이캡슐','海雲台','沿海岸行駛的觀光膠囊；尾浦 → 青沙浦。',30,'https://www.bluelinepark.com/'],
['cheongsapo','青沙浦','청사포','青沙浦','海岸拍照、散步。',40,null],
['train','海岸列車','해운대 해변열차','青沙浦','青沙浦 → 尾浦；需確認班次與末班車，無法搭乘則改計程車。',40,'https://www.bluelinepark.com/'],
['gamcheon','甘川文化村','감천문화마을','甘川洞','彩色山城與小王子拍照點。',75,null],
['jagalchi','札嘎其市場','자갈치시장','南浦','一樓挑選活海鮮，再到合作二樓餐廳料理。',120,null],
['cable','松島海上纜車','송도해상케이블카','松島','一般／透明玻璃底、單程／來回均保留，尚未選票。',90,'https://en.busanaircruise.co.kr/'],
['spa','Spa Haesurang 汗蒸幕','스파해수랑','松島','四位大人希望一起使用共用汗蒸空間。',180,null],
['seomyeon','西面商圈','서면','西面','地下街、服飾、Olive Young、韓國美妝、零食伴手禮與百貨公司。',150,null],
['gwangalli','廣安里海灘','광안리해수욕장','廣安里','海景咖啡、海灘散步與夜景。',105,null],
['millac','民樂 The Market','밀락더마켓','廣安里','彈性室內景點，不強制加入主行程。',null,null],
['drone','廣安里無人機燈光秀','광안리 M 드론 라이트쇼','廣安里','預計 20:00 觀賞，可能受天候影響。',null,'https://www.gwangallimdrone.co.kr/en/overview'],
['biff','BIFF 廣場','BIFF 광장','南浦','備用景點，不加入主要時間軸。',null,null],['gukje','國際市場','국제시장','南浦','備用景點，不加入主要時間軸。',null,null],['bupyeong','富平罐頭市場','부평깡통시장','南浦','備用景點，不加入主要時間軸。',null,null]
].map(([id,nameZh,nameKo,area,description,recommendedDurationMinutes,bookingUrl])=>({id,nameZh,nameKo,area,category:'attraction',description,recommendedDurationMinutes,bookingRequired:['luge','sky-capsule','train','cable'].includes(id),bookingUrl,address:null,latitude:null,longitude:null,googleMapsUrl:null,naverMapsUrl:null,instagramUrl:null,instagramType:'unverified',image:null,hours:null,ticketPrice:null,verifiedAt:null,verificationStatus:'unverified',notes:[]}));
const p=(id)=>places.find(p=>p.id===id);
p('sky-capsule').notes=['17:00～17:30 為目標預約時段；排隊可能影響實際搭乘。','天空膠囊及海岸列車需提前確認訂票、搭乘方向與末班時間。'];
p('train').notes=['18:10～18:50 為暫定時間，請確認當日班次與末班車。'];
p('cable').notes=['票價待確認；出發前核實。','如選單程，抵達對岸後須另安排交通前往汗蒸幕。'];
p('spa').notes=['地址、營業時間待確認。','需確認男女可共用的汗蒸空間與 2027 年營業狀況。'];p('spa').referenceUrl='https://feitravel.tw/busan-spa-haesurang-songdo-sea-view/';
p('drone').notes=['2027/03/13 場次與時間待官方確認。'];p('seomyeon').notes=['部分店家約 10:30～11:00 才開始營業。'];
p('jagalchi').steps=['一樓挑選活海鮮。','與攤販確認海鮮重量、總價、代客料理費、座位費。','前往合作的二樓餐廳料理。','享用海鮮午餐。'];p('jagalchi').notes=['前一天已吃螃蟹，今天不必再以螃蟹為主。','午餐可能需 90～120 分鐘，後續行程保留彈性。','參考攤位，現場核實。'];
const assign=(d,i,values)=>Object.assign(days[d-1].activities[i-1],values);
[[1,2,'airport'],[1,7,'haeundae'],[2,2,'luge'],[2,4,'gijang'],[2,6,'mipo'],[2,7,'sky-capsule'],[2,8,'cheongsapo'],[2,9,'train'],[3,2,'gamcheon'],[3,3,'jagalchi'],[3,4,'cable'],[3,5,'spa'],[4,3,'seomyeon'],[4,8,'gwangalli'],[4,10,'gwangalli'],[4,11,'drone'],[5,6,'airport'],[5,7,'airport']].forEach(([d,i,id])=>assign(d,i,{placeId:id}));
[[1,6,'d1-dinner'],[2,4,'d2-lunch'],[2,10,'d2-dinner'],[3,3,'d3-lunch'],[3,6,'d3-dinner'],[4,4,'d4-lunch'],[4,8,'d4-cafe'],[4,9,'d4-dinner'],[5,1,'d5-breakfast']].forEach(([d,i,id])=>assign(d,i,{restaurantGroupId:id,type:'food'}));
assign(2,10,{notes:['海雲台其他晚餐保留為彈性備案，店名尚未確認。']});
assign(5,4,{timeStatus:'flexible',notes:['原規劃 10:30～11:00；建議 10:30 前完成退房，10:30～10:45 出發。']});assign(5,5,{timeStatus:'flexible',notes:['與退房合併安排，並非另一個確定行程。']});
const transfers=[[1,4,'金海機場','海雲台預計住宿','大型計程車','60～90 分鐘','機場巴士／地鐵＋輕軌','視方式而定'],[2,1,'海雲台','斜坡滑車','計程車','45～60 分鐘','大眾運輸','否'],[2,3,'斜坡滑車','機張市場','計程車','30～45 分鐘','公車','否'],[2,5,'機張市場','尾浦站','計程車','45～60 分鐘','大眾運輸','否'],[3,8,'松島','海雲台','計程車','50～90 分鐘','地鐵轉乘','否'],[4,2,'海雲台','西面','地鐵','40～60 分鐘','計程車','否'],[4,5,'西面','海雲台預計住宿','地鐵','40～60 分鐘','計程車','否'],[4,7,'海雲台','廣安里','計程車','30～50 分鐘','地鐵＋步行','否'],[4,12,'廣安里','海雲台','地鐵／計程車','30～60 分鐘','候車人多時提早離開','視方式而定'],[5,5,'海雲台預計住宿','金海機場','預約大型計程車','60～100 分鐘','機場巴士／地鐵＋輕軌','視方式而定']];
transfers.forEach(([d,i,from,to,mode,duration,alternative,transfer])=>assign(d,i,{type:'transport',transport:{from,to,mode,duration,alternative,transfer,note:'規劃預估，非即時交通；住宿地址未核實。'}}));
days[2].backupPlaceIds=['biff','gukje','bupyeong'];days[3].backupPlaceIds=['millac'];
write('itinerary',days);write('restaurants',restaurants);write('restaurant-groups',groups);write('places',places);
write('trip',{title:'2027 釜山五天四夜自由行 🇰🇷',subtitle:'2027/03/10（三）～03/14（日）｜4 位大人｜Busan Travel Journal',startDate:'2027-03-10',endDate:'2027-03-14',travelers:4,timezone:'Asia/Seoul',coverImage:null,flights:[{code:'BX572',date:'2027/03/10（三）',from:'桃園 TPE',to:'釜山 PUS',departure:'13:25 台灣時間（UTC+8）',arrival:'約 17:00 韓國時間（UTC+9）'},{code:'BX575',date:'2027/03/14（日）',from:'釜山 PUS',to:'桃園 TPE',departure:'15:00 韓國時間（UTC+9）',arrival:'待確認'}],airline:'釜山航空 Air Busan',flightNote:'旅客提供的暫定資料；出發前確認航班。',lodging:{name:'海雲台 Airbnb',status:'預計住宿・尚未確認訂房',url:'https://www.airbnb.com.tw/rooms/1763027705885706552',address:null,note:'地址尚未核實，不提供住宿導航。'},reminders:['韓國使用韓元 KRW。','韓國時間比台灣快一小時，行程預設為 KST（UTC+9）。','建議攜帶行動電源。','三月可能偏冷，準備保暖衣物。','重要證件與訂房資訊不要公開在網站上。','收藏儲存在個人裝置，不會自動同步給旅伴。'],airportTransport:[{name:'計程車',time:'約 60～100 分鐘',note:'一般車不一定能放下四個大型行李箱；可能需分乘兩台。'},{name:'大型計程車',time:'約 60～100 分鐘',note:'事先確認四人及四個大型行李箱的容量並預約。'},{name:'機場巴士',time:'約 80～120 分鐘',note:'路線、班次、站點、行李限制待確認。'},{name:'地鐵＋輕軌',time:'約 90～120 分鐘',note:'需轉車；預留步行與搬運行李時間。'}],transportNote:'以上均為行程規劃預估，非即時交通；車資待確認，塞車可能增加時間。'});
console.log(`Generated ${days.length} days, ${days.reduce((n,d)=>n+d.activities.length,0)} activities, ${restaurants.length} restaurants, ${places.length} places.`);
