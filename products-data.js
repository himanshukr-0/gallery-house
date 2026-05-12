// Gallery House – Shared Product Database (localStorage)
const INITIAL_PRODUCTS = [
  { id:1, name:"Samsung Galaxy S24 Ultra", brand:"Samsung", cat:"mobile", emoji:"📱", price:109999, mrp:129999, discount:15, emiMonths:12, badge:"Bestseller", photo:"", stock:45,
    specs:{"Display":"6.8\" AMOLED 2X 120Hz","Chip":"Snapdragon 8 Gen 3","RAM":"12 GB","Storage":"256 GB","Camera":"200MP + 12MP + 10MP","Battery":"5000 mAh 45W Fast Charge","OS":"Android 14","5G":"Yes","Weight":"232g"},
    reviews:[{user:"Rajesh K.",stars:5,date:"Apr 2026",text:"Incredible camera system! Best Android phone I've ever used.",verified:true},{user:"Anita S.",stars:4,date:"Mar 2026",text:"Premium build quality, AI features are genuinely useful.",verified:true},{user:"Vikram P.",stars:5,date:"Feb 2026",text:"200MP camera is mind-blowing. Worth every rupee!",verified:false}]
  },
  { id:2, name:"Apple iPhone 15 Pro", brand:"Apple", cat:"mobile", emoji:"📱", price:129999, mrp:149999, discount:13, emiMonths:12, badge:"New", photo:"", stock:30,
    specs:{"Display":"6.1\" Super Retina XDR OLED","Chip":"Apple A17 Pro","RAM":"8 GB","Storage":"128 GB","Camera":"48MP Main + 12MP UW + 12MP Tele","Battery":"3274 mAh USB-C","OS":"iOS 17","Build":"Titanium Frame","Weight":"187g"},
    reviews:[{user:"Meera T.",stars:5,date:"Apr 2026",text:"Best iPhone ever. Titanium frame is superb.",verified:true},{user:"Arjun B.",stars:5,date:"Feb 2026",text:"Switched from Android. Absolutely no regrets!",verified:true}]
  },
  { id:3, name:"OnePlus 12R 5G", brand:"OnePlus", cat:"mobile", emoji:"📱", price:39999, mrp:49999, discount:20, emiMonths:6, badge:"Hot", photo:"", stock:80,
    specs:{"Display":"6.78\" AMOLED 120Hz","Chip":"Snapdragon 8 Gen 2","RAM":"8 GB","Storage":"128 GB","Camera":"50MP + 8MP + 2MP","Battery":"5500 mAh 100W","OS":"OxygenOS 14","5G":"Yes","Weight":"207g"},
    reviews:[{user:"Karan M.",stars:4,date:"Mar 2026",text:"Excellent value for money. Fast charging is insane!",verified:true}]
  },
  { id:4, name:"HP Pavilion 15 Laptop", brand:"HP", cat:"laptop", emoji:"💻", price:54999, mrp:69999, discount:21, emiMonths:12, badge:"Sale", photo:"", stock:25,
    specs:{"Display":"15.6\" FHD IPS 144Hz","Processor":"Intel Core i7-13th Gen","RAM":"16 GB DDR4","Storage":"512 GB SSD","GPU":"NVIDIA RTX 4050 4GB","Battery":"41Wh 45W Charging","OS":"Windows 11","Weight":"1.75 kg"},
    reviews:[{user:"Suresh D.",stars:4,date:"Apr 2026",text:"Great performance for the price. Display is stunning.",verified:true},{user:"Pooja R.",stars:5,date:"Jan 2026",text:"Perfect for college and gaming both!",verified:true}]
  },
  { id:5, name:"MacBook Air M3", brand:"Apple", cat:"laptop", emoji:"💻", price:119999, mrp:134999, discount:11, emiMonths:24, badge:"Premium", photo:"", stock:15,
    specs:{"Display":"13.6\" Liquid Retina","Chip":"Apple M3 8-core CPU","RAM":"8 GB Unified","Storage":"256 GB SSD","GPU":"10-core GPU","Battery":"52.6Wh 18h life","OS":"macOS Sonoma","Weight":"1.24 kg"},
    reviews:[{user:"Nisha K.",stars:5,date:"Apr 2026",text:"Fastest laptop I've ever used. Silent and light!",verified:true}]
  },
  { id:6, name:"Samsung 55\" QLED 4K TV", brand:"Samsung", cat:"tv", emoji:"📺", price:74999, mrp:99999, discount:25, emiMonths:12, badge:"Bestseller", photo:"", stock:20,
    specs:{"Screen":"55\" QLED 4K UHD","Resolution":"3840 x 2160","Refresh Rate":"120Hz","Smart":"Tizen OS, Alexa Built-in","HDR":"Quantum HDR+","Connectivity":"4x HDMI, 2x USB","Audio":"40W Dolby Atmos","Panel":"Quantum Dot"},
    reviews:[{user:"Mohit G.",stars:5,date:"Mar 2026",text:"Picture quality is out of this world. Love the quantum colors!",verified:true},{user:"Rekha J.",stars:4,date:"Feb 2026",text:"Easy setup and amazing smart features.",verified:true}]
  },
  { id:7, name:"Sony Bravia 65\" OLED", brand:"Sony", cat:"tv", emoji:"📺", price:179999, mrp:219999, discount:18, emiMonths:24, badge:"Premium", photo:"", stock:8,
    specs:{"Screen":"65\" OLED 4K","Resolution":"3840 x 2160","Processor":"XR Cognitive Processor","Smart":"Google TV","HDR":"Dolby Vision, HDR10","Audio":"Acoustic Surface Audio+","Connectivity":"4x HDMI 2.1","OLED":"True Black Technology"},
    reviews:[{user:"Sanjay P.",stars:5,date:"Apr 2026",text:"Absolutely cinematic experience. OLED blacks are perfect.",verified:true}]
  },
  { id:8, name:"Samsung 1.5T Inverter AC", brand:"Samsung", cat:"ac", emoji:"❄️", price:42999, mrp:54999, discount:22, emiMonths:12, badge:"Top Pick", photo:"", stock:35,
    specs:{"Capacity":"1.5 Ton","Star Rating":"5 Star BEE","Type":"Split Inverter","Cooling":"Fast Cooling Mode","WiFi":"SmartThings App","Auto Clean":"Yes","Anti-bacteria Filter":"Yes","Warranty":"10yr Compressor, 5yr PCB"},
    reviews:[{user:"Amit V.",stars:5,date:"Apr 2026",text:"Cools the room in minutes. Very energy efficient!",verified:true},{user:"Deepa S.",stars:4,date:"Mar 2026",text:"Smart controls via app are very handy.",verified:true}]
  },
  { id:9, name:"LG 360L Double Door Fridge", brand:"LG", cat:"fridge", emoji:"🧊", price:39999, mrp:52999, discount:25, emiMonths:12, badge:"Popular", photo:"", stock:18,
    specs:{"Capacity":"360 Litres","Type":"Double Door Frost Free","Star Rating":"2 Star","Compressor":"Smart Inverter","Stabilizer Free":"160V-310V","Door Cooling":"Yes","Deodorizer":"Activated Carbon","Warranty":"10yr Compressor"},
    reviews:[{user:"Sunita R.",stars:5,date:"Mar 2026",text:"Spacious and very quiet. Keeps vegetables fresh longer!",verified:true}]
  },
  { id:10, name:"Samsung 8kg Front Load WM", brand:"Samsung", cat:"washing-machine", emoji:"🫧", price:44999, mrp:59999, discount:25, emiMonths:12, badge:"AI Wash", photo:"", stock:22,
    specs:{"Capacity":"8 kg","Type":"Front Load Fully Automatic","Motor":"Inverter Motor","Programs":"21 Wash Programs","Speed":"1400 RPM","AI":"AI Control, Auto Dose","Energy":"5 Star","Warranty":"10yr Motor, 3yr Parts"},
    reviews:[{user:"Priya M.",stars:5,date:"Apr 2026",text:"AI dosing saves detergent. Clothes come out spotless!",verified:true},{user:"Ravi T.",stars:4,date:"Feb 2026",text:"Quiet operation, great features for the price.",verified:true}]
  },
  { id:11, name:"Xiaomi Pad 6 Pro", brand:"Xiaomi", cat:"tablet", emoji:"📟", price:26999, mrp:32999, discount:18, emiMonths:6, badge:"New", photo:"", stock:40,
    specs:{"Display":"11\" 2.8K AMOLED 144Hz","Chip":"Snapdragon 8+ Gen 1","RAM":"8 GB","Storage":"256 GB","Camera":"50MP Rear 20MP Front","Battery":"8600 mAh 67W","OS":"MIUI 14","Connectivity":"WiFi 6, Bluetooth 5.3"},
    reviews:[{user:"Rahul S.",stars:4,date:"Mar 2026",text:"Brilliant display and fast charging. Great productivity tablet.",verified:true}]
  },
  { id:12, name:"Symphony Hicool 31L Cooler", brand:"Symphony", cat:"cooler", emoji:"💨", price:9999, mrp:13499, discount:26, emiMonths:3, badge:"Bestseller", photo:"", stock:60,
    specs:{"Capacity":"31 Litres","Coverage":"400 sq.ft","Motor":"200W Powerful","Speeds":"3 Speed Settings","Remote":"Yes","Timer":"8 Hour Timer","Castor Wheels":"Yes","Warranty":"1yr Product, 2yr Motor"},
    reviews:[{user:"Suresh K.",stars:5,date:"Apr 2026",text:"Best cooler for the price. Cools large rooms effectively!",verified:true}]
  }
];

function initProducts(){
  if(!localStorage.getItem('gh_products')) localStorage.setItem('gh_products', JSON.stringify(INITIAL_PRODUCTS));
}
function getProducts(){ initProducts(); return JSON.parse(localStorage.getItem('gh_products')||'[]'); }
function saveProducts(p){ localStorage.setItem('gh_products', JSON.stringify(p)); }
function getProduct(id){ return getProducts().find(p=>p.id===parseInt(id)); }
function updateProduct(upd){
  const p=getProducts(), idx=p.findIndex(x=>x.id===upd.id);
  if(idx!==-1) p[idx]=upd; else p.push(upd);
  saveProducts(p);
}
function deleteProduct(id){ saveProducts(getProducts().filter(p=>p.id!==parseInt(id))); }
function calcEMI(price, months){ return Math.round(price/months); }

// Cart helpers
function getCart(){ return JSON.parse(localStorage.getItem('gh_cart')||'[]'); }
function saveCart(c){ localStorage.setItem('gh_cart',JSON.stringify(c)); }
function addToCartStore(product, qty=1, variants={}){
  const cart=getCart();
  // Match both ID and variants to group items properly
  const existing=cart.find(i => i.id===product.id && JSON.stringify(i.variants||{}) === JSON.stringify(variants));
  if(existing) existing.qty+=qty;
  else cart.push({...product, qty, variants});
  saveCart(cart);
  return getCart().reduce((s,i)=>s+i.qty,0);
}
function removeFromCart(id){ saveCart(getCart().filter(i=>i.id!==id)); }
function clearCart(){ localStorage.removeItem('gh_cart'); }
function getCartTotal(){ return getCart().reduce((s,i)=>s+(i.price*i.qty),0); }
