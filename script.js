let money = 500, inventory = [], customers = [], maxInv = 10;
let shopReg = [], shopBM = [];
let level = 1, exp = 0, isNight = false, rating = 5.0, timer = 180;
let missions = [], isPaused = false;
let shopTimerReg = 30, shopTimerBM = 180, spawnTimer = 0;
let isGoldenHour = false, isBlackFriday = false, postBlackFriday = false;
let staff = { sec: null, waiterCount: 0, chef: null, valet: null };
let currentShopTab = 'reg';

// BIẾN CỜ CHẶN LỖI LƯU CHỒNG KHI RESET
let isResetting = false; 

const SAVE_KEY = 'GachaChef_Final_V8_Stable';

function save() {
    if (isResetting) return; // NẾU ĐANG RESET THÌ KHÔNG LƯU ĐỂ TRÁNH LỖI BÓNG MA
    localStorage.setItem(SAVE_KEY, JSON.stringify({ money, inv: inventory, maxInv, shopReg, shopBM, cust: customers, level, exp, rating, isNight, timer, missions, isBlackFriday, postBlackFriday, shopTimerReg, shopTimerBM, staff }));
}

function load() {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (d) {
        money = d.money; inventory = d.inv || []; maxInv = d.maxInv || 10; 
        shopReg = d.shopReg || []; shopBM = d.shopBM || [];
        customers = d.cust || []; level = d.level || 1; exp = d.exp || 0; rating = parseFloat(d.rating) || 5.0;
        isNight = d.isNight || false; timer = d.timer || 180; missions = d.missions || [];
        isBlackFriday = d.isBlackFriday || false; postBlackFriday = d.postBlackFriday || false;
        shopTimerReg = d.shopTimerReg || 30; shopTimerBM = d.shopTimerBM || 180;
        staff = d.staff || { sec: null, waiterCount: 0, chef: null, valet: null };
    }
}

// 🔥 HÀM RESET BẤT TỬ 🔥
window.resetGameData = function() {
    if (confirm("🚨 CẢNH BÁO 🚨\nBạn có chắc chắn muốn XÓA SẠCH toàn bộ tiến trình chơi?")) {
        isResetting = true; // Bật cờ chặn hàm save()
        localStorage.clear(); // Xóa sạch mọi thứ
        sessionStorage.clear();
        window.location.reload(); // Ép F5
    }
};

function showScreen(id, btnElement) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active-screen'));
    document.getElementById(id).classList.add('active-screen');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
    updateUI();
}

window.switchShopTab = function(tab) {
    currentShopTab = tab;
    document.getElementById('tab-reg').classList.toggle('active', tab === 'reg');
    document.getElementById('tab-bm').classList.toggle('active', tab === 'bm');
    document.getElementById('panel-reg').style.display = tab === 'reg' ? 'block' : 'none';
    document.getElementById('panel-bm').style.display = tab === 'bm' ? 'block' : 'none';
}

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pause-overlay').style.display = isPaused ? 'flex' : 'none';
}

function generateMissions() {
    missions = [
        { id: 1, text: "Phục vụ 5 khách", goal: 5, cur: 0, rewardType: 'money', rewardVal: 500, done: false },
        { id: 2, text: "Nấu món Tier 2+", goal: 1, cur: 0, rewardType: 'item', rewardVal: 101, done: false }
    ];
}

// --- VÒNG LẶP THỜI GIAN ---
setInterval(() => {
    if (isPaused || isResetting) return; // Nếu đang reset thì dừng chạy logic
    
    timer--;
    document.getElementById('timer-bar').style.width = (timer / 180 * 100) + "%";
    
    shopTimerReg--; if(shopTimerReg <= 0) refreshRegShop(false);
    shopTimerBM--; if(shopTimerBM <= 0) refreshBMShop(false);
    
    spawnTimer++;
    const baseMax = 3 + (staff.valet ? staff.valet.extraSlot : 0);
    const maxCust = (isBlackFriday || postBlackFriday) ? baseMax + 3 : baseMax;
    const spawnRate = (isBlackFriday || postBlackFriday) ? 10 : 15;
    
    if(spawnTimer >= spawnRate) { spawnTimer = 0; if(customers.length < maxCust) spawnCustomer(); }

    if (timer <= 0) {
        if (isNight) {
            handleNightThieves(); 
            generateMissions();
            if(isBlackFriday) { isBlackFriday = false; postBlackFriday = true; }
            else if(postBlackFriday) { postBlackFriday = false; }
            isBlackFriday = (!postBlackFriday && Math.random() < 0.05);
        }
        isNight = !isNight; timer = 180;
        isGoldenHour = Math.random() < 0.05;
    }

    customers.forEach((c, i) => {
        c.pat--;
        if (c.pat <= 0) { rating = Math.max(1, (rating - 0.4)).toFixed(1); customers.splice(i, 1); }
    });
    updateUI();
}, 1000);

function handleNightThieves() {
    let thiefCount = Math.floor(level / 4) + 1; 
    let stolenNames = [];
    let blockedCount = 0;

    for (let i = 0; i < thiefCount; i++) {
        if (inventory.length === 0) break;
        let blockChance = staff.sec ? staff.sec.block : 0;
        if (Math.random() < blockChance) { blockedCount++; continue; }

        let targetIdx = Math.floor(Math.random() * inventory.length);
        inventory[targetIdx].qty--;
        stolenNames.push(inventory[targetIdx].name);
        if (inventory[targetIdx].qty <= 0) inventory.splice(targetIdx, 1);
    }
    let msg = "";
    if (blockedCount > 0) msg += `🛡 Vệ sĩ đã tóm được ${blockedCount} tên trộm!\n`;
    if (stolenNames.length > 0) msg += `‼️ Trộm đã lẻn vào kho lấy mất: ${stolenNames.join(', ')}`;
    if (msg !== "") alert(msg);
}

function updateUI() {
    if (isResetting) return; // Nếu đang Reset thì bỏ qua bước vẽ UI

    document.getElementById('money').innerText = money;
    document.getElementById('rating').innerText = rating;
    document.getElementById('lvl').innerText = level;
    document.getElementById('inv').innerText = inventory.length;
    document.getElementById('max').innerText = maxInv;
    document.getElementById('exp-fill').style.width = (exp / (level * 100) * 100) + "%";
    
    document.getElementById('shop-timer-reg').innerText = shopTimerReg;
    document.getElementById('shop-timer-bm').innerText = shopTimerBM;

    const baseMax = 3 + (staff.valet ? staff.valet.extraSlot : 0);
    const maxCust = (isBlackFriday || postBlackFriday) ? baseMax + 3 : baseMax;
    const countEl = document.getElementById('cust-count');
    if(countEl) countEl.innerText = `${customers.length}/${maxCust}`;

    const banner = document.getElementById('world-banner');
    banner.innerText = isNight ? "🌙 BAN ĐÊM" : "🌞 BAN NGÀY";
    banner.className = `badge ${isNight ? 'night-badge' : 'day-badge'}`;
    
    const notice = document.getElementById('event-notice');
    if(isBlackFriday) { notice.style.display = 'block'; notice.innerText = "🔥 BLACK FRIDAY: Khách đông, món rẻ!"; }
    else if(postBlackFriday) { notice.style.display = 'block'; notice.innerText = "⚡ HẬU BLACK FRIDAY: Khách vẫn đông!"; }
    else if(isGoldenHour) { notice.style.display = 'block'; notice.innerText = "⭐ GIỜ VÀNG: Tăng tỉ lệ VIP!"; }
    else { notice.style.display = 'none'; }

    const activeId = document.querySelector('.active-screen').id;
    if (activeId === 'restaurant') renderCustomers();
    if (activeId === 'shop') renderShop();
    if (activeId === 'inventory') renderInventory();
    if (activeId === 'staff') renderStaff();
    if (activeId === 'recipes') renderRecipeBook();
    if (activeId === 'missions') renderMissionsUI();
    save();
}

function spawnCustomer() {
    let r = Math.random() * 100;
    let t3 = isGoldenHour ? 8 : 4; let t4 = isGoldenHour ? 2 : 1; 
    let tier = r < t4 ? 4 : (r < t4 + t3 ? 3 : (r < t4 + t3 + 15 ? 2 : 1));

    const pool = GUESTS.filter(g => g.tier === tier);
    const guest = pool[Math.floor(Math.random() * pool.length)];
    
    let targetRecipe;
    const avaiRecipes = RECIPES.filter(r => r.tier === tier && r.minLv <= level);
    
    if (tier === 4) targetRecipe = RECIPES.find(r => r.id === guest.sign && r.minLv <= level);
    else if (tier === 3 && guest.fav && Math.random() < 0.5) targetRecipe = RECIPES.find(r => r.id === guest.fav && r.minLv <= level);
    if (!targetRecipe && avaiRecipes.length > 0) targetRecipe = avaiRecipes[Math.floor(Math.random() * avaiRecipes.length)];

    if(targetRecipe) {
        let basePat = 40 + (staff.waiterCount * 5);
        customers.push({ uid: Date.now(), name: guest.name, icon: guest.icon, tier: guest.tier, recipe: targetRecipe, pat: basePat, maxPat: basePat });
    }
}

window.serve = function(i) {
    try {
        const c = customers[i];
        const r = RECIPES.find(res => res.id === c.recipe.id);
        
        for (let id of r.ings) {
            let invIdx = inventory.findIndex(item => item.id === id);
            if(invIdx !== -1) { inventory[invIdx].qty--; }
        }
        inventory = inventory.filter(item => item.qty > 0);

        let basePrice = isBlackFriday ? r.price * 0.85 : r.price;
        let chefMult = staff.chef ? staff.chef.mult : 1.0; 
        let finalPrice = Math.floor(basePrice * ((Math.random() * 0.2) + 0.9) * (rating/5) * chefMult);
        if (c.tier >= 2 && Math.random() < 0.3) finalPrice += Math.floor(finalPrice * 0.2);
        
        money += finalPrice; exp += r.exp;
        if (c.pat > c.maxPat * 0.6) rating = Math.min(10, (parseFloat(rating) + 0.2)).toFixed(1);

        updateMissions('serve', 1); if(r.tier >= 2) updateMissions('tier2', 1);
        while (exp >= level * 100) { exp -= level * 100; level++; }
        
        customers.splice(i, 1); 
        updateUI();
    } catch(err) {
        console.error(err);
        customers.splice(i, 1); 
        updateUI();
    }
}

window.skipCustomer = function(i) { rating = Math.max(1, (rating - 0.5)).toFixed(1); customers.splice(i, 1); updateUI(); }
window.resetCustomers = function() { if (money < 10) return; money -= 10; customers = []; for(let i=0; i<3; i++) spawnCustomer(); updateUI(); }

window.refreshRegShop = function(paid) {
    if (paid) { if (money < 10) return alert("Cần 10$"); money -= 10; }
    shopReg = []; shopTimerReg = 30;
    const pool = INGREDIENTS.filter(ig => !ig.isBM);
    for (let i = 0; i < 6; i++) {
        const rand = Math.random() * 100;
        shopReg.push(rand < 5 ? (pool.find(ig => ig.rarity === 'Rare') || pool[0]) : pool[Math.floor(Math.random() * pool.length)]);
    }
    updateUI();
}

window.refreshBMShop = function(paid) {
    if (paid) { if (money < 30) return alert("Cần 30$"); money -= 30; }
    shopBM = []; shopTimerBM = 180;
    const pool = INGREDIENTS.filter(ig => ig.isBM);
    for (let i = 0; i < 6; i++) {
        shopBM.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    updateUI();
}

window.buyItem = function(type, i) {
    let item = type === 'reg' ? shopReg[i] : shopBM[i];
    if (money < item.price) return alert("Hết tiền!");
    
    let existingSlot = inventory.find(inv => inv.id === item.id && inv.qty < 64);
    if (existingSlot) existingSlot.qty++;
    else {
        if (inventory.length >= maxInv) return alert("Kho đầy!");
        inventory.push({ id: item.id, name: item.name, icon: item.icon, price: item.price, color: item.color, qty: 1, uid: "item_" + Date.now() + Math.random().toString(36).substr(2) });
    }
    money -= item.price; 
    if(type === 'reg') shopReg.splice(i, 1); else shopBM.splice(i, 1);
    updateUI();
}

window.removeItemByUid = function(event, uid) {
    if(event) event.stopPropagation();
    let idx = inventory.findIndex(i => i.uid === uid);
    if(idx !== -1) {
        inventory[idx].qty--;
        if(inventory[idx].qty <= 0) inventory.splice(idx, 1);
        updateUI();
    }
};

window.upgradeInventory = function() { if (money < 300) return alert("Thiếu 300$!"); money -= 300; maxInv += 1; updateUI(); }

window.hireStaff = function(type, id) {
    let job = JOBS[type].find(j => j.id === id);
    if(money < job.price) return alert("Không đủ tiền thuê!");
    money -= job.price;
    if(type === 'waiter') staff.waiterCount++; else staff[type] = job;
    updateUI();
}

// --- RENDER GIAO DIỆN ---
function renderCustomers() {
    const list = document.getElementById('customer-list');
    list.innerHTML = customers.map((c, i) => {
        const r = RECIPES.find(res => res.id === c.recipe.id);
        
        let tempInv = JSON.parse(JSON.stringify(inventory));
        let canCook = true;
        for(let id of r.ings) {
            let slot = tempInv.find(item => item.id === id && item.qty > 0);
            if(!slot) { canCook = false; break; }
            slot.qty--;
        }

        const pPer = (c.pat / c.maxPat) * 100;
        const tColor = c.tier === 4 ? 'var(--warning)' : (c.tier === 3 ? '#c084fc' : 'var(--text-main)');
        
        let chefMult = staff.chef ? staff.chef.mult : 1.0;
        let baseP = isBlackFriday ? r.price * 0.85 : r.price;
        let minP = Math.floor(baseP * 0.9 * (rating/5) * chefMult);
        let maxP = Math.floor(baseP * 1.1 * (rating/5) * chefMult);
        if (c.tier >= 2) maxP += Math.floor(maxP * 0.2); 
        
        return `
            <div class="card">
                <div class="flex-between">
                    <div>
                        <b style="color:${tColor}; font-size:1.15rem">${c.icon} ${c.name}</b><br>
                        <small class="text-muted">Món: 🍽️ ${c.recipe.name}</small><br>
                        <small class="text-highlight">💰 ~${minP}$ - ${maxP}$</small>
                    </div>
                    <div style="display:flex; gap:6px;">
                        <button class="btn btn-sm btn-success" ${canCook ? '' : 'disabled'} onclick="window.serve(${i})">Bán</button>
                        <button class="btn btn-sm btn-danger" onclick="window.skipCustomer(${i})">Bỏ</button>
                    </div>
                </div>
                <div class="pat-track"><div class="pat-fill ${pPer < 30 ? 'danger' : ''}" style="width:${pPer}%"></div></div>
            </div>`;
    }).join('');
}

function renderInventory() {
    document.getElementById('inventory-list').innerHTML = inventory.map(i => `
        <span class="item-tag" style="color:${i.color}">${i.icon} ${i.name} <b style="color:var(--gold); margin:0 5px;">x${i.qty}</b> 
        <span class="del-btn" onclick="window.removeItemByUid(event, '${i.uid}')">✖</span></span>`).join('');
}

function renderShop() {
    document.getElementById('shop-list-reg').innerHTML = shopReg.map((item, idx) => `
        <div class="card text-center"><div style="font-size:2rem; margin-bottom:5px;">${item.icon}</div><b style="color:${item.color}">${item.name}</b><div class="text-muted mt-2">${item.price}$</div><button class="btn btn-sm btn-primary mt-2" onclick="window.buyItem('reg', ${idx})">Mua</button></div>`).join('');
    
    document.getElementById('shop-list-bm').innerHTML = shopBM.map((item, idx) => `
        <div class="card text-center"><div style="font-size:2rem; margin-bottom:5px;">${item.icon}</div><b style="color:${item.color}">${item.name}</b><div class="text-muted mt-2">${item.price}$</div><button class="btn btn-sm mt-2" style="background:#7e22ce; color:white" onclick="window.buyItem('bm', ${idx})">Mua</button></div>`).join('');
}

function renderStaff() {
    let html = '';
    html += `<h4 class="text-highlight mb-3">Vệ sĩ ${staff.sec ? ' - '+staff.sec.name : ''}</h4>`;
    html += `<div class="grid-auto mb-3">` + JOBS.security.map(j => `<div class="card text-center"><div style="font-size:1.5rem">${j.icon}</div><b>${j.name}</b><br><small class="text-muted">${j.desc}</small><button class="btn btn-sm btn-primary mt-3" onclick="window.hireStaff('security', '${j.id}')">${j.price}$</button></div>`).join('') + `</div>`;
    html += `<h4 class="text-highlight mb-3">Phục vụ - Số lượng: ${staff.waiterCount}</h4>`;
    html += `<div class="grid-auto mb-3">` + JOBS.waiter.map(j => `<div class="card text-center"><div style="font-size:1.5rem">${j.icon}</div><b>${j.name}</b><br><small class="text-muted">${j.desc}</small><button class="btn btn-sm btn-primary mt-3" onclick="window.hireStaff('waiter', '${j.id}')">${j.price}$</button></div>`).join('') + `</div>`;
    html += `<h4 class="text-highlight mb-3">Đầu bếp ${staff.chef ? ' - '+staff.chef.name : ''}</h4>`;
    html += `<div class="grid-auto mb-3">` + JOBS.chef.map(j => `<div class="card text-center"><div style="font-size:1.5rem">${j.icon}</div><b>${j.name}</b><br><small class="text-muted">${j.desc}</small><button class="btn btn-sm btn-primary mt-3" onclick="window.hireStaff('chef', '${j.id}')">${j.price}$</button></div>`).join('') + `</div>`;
    html += `<h4 class="text-highlight mb-3">Trông xe ${staff.valet ? ' - '+staff.valet.name : ''}</h4>`;
    html += `<div class="grid-auto mb-3">` + JOBS.valet.map(j => `<div class="card text-center"><div style="font-size:1.5rem">${j.icon}</div><b>${j.name}</b><br><small class="text-muted">${j.desc}</small><button class="btn btn-sm btn-primary mt-3" onclick="window.hireStaff('valet', '${j.id}')">${j.price}$</button></div>`).join('') + `</div>`;
    document.getElementById('staff-list').innerHTML = html;
}

function renderRecipeBook() {
    document.getElementById('recipe-list').innerHTML = RECIPES.map(r => {
        if(level < r.minLv) return `<div class="card text-center text-muted">🔒 Lv.${r.minLv}</div>`;
        const ingNames = r.ings.map(id => {
            let ig = INGREDIENTS.find(i => i.id === id);
            return `${ig.icon} ${ig.name}`;
        }).join(' + ');
        return `<div class="card"><b>🍽️ ${r.name} <span class="text-highlight">(Tier ${r.tier})</span></b><small class="text-muted">Cần: ${ingNames}</small></div>`;
    }).join('');
}

function renderMissionsUI() {
    document.getElementById('mission-list').innerHTML = missions.map(m => `
        <div class="card ${m.done ? 'night-badge' : ''}"><p>🎯 ${m.text} (${m.cur}/${m.goal})</p><b class="text-highlight">${m.done ? 'ĐÃ NHẬN' : (m.rewardType === 'money' ? m.rewardVal + '$' : '🎁 Vật phẩm')}</b></div>`).join('');
}

load(); if (missions.length === 0) generateMissions();
updateUI(); if (shopReg.length === 0) refreshRegShop(false); if (shopBM.length === 0) refreshBMShop(false);