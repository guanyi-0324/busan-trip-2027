export function koreaDate(now = new Date()) {return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export function todayIndex(days, now=new Date()) {return days.findIndex(d=>d.date===koreaDate(now));}
