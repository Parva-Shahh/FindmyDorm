/**
 * FILE: zh_listings.js  —  Chinese locale  —  cards left / map right
 * Pre-filter from index via window._preFilter
 * Room types: En-Suite, Studio, Shared
 */
document.addEventListener('DOMContentLoaded', function () {

  var searchInput = document.getElementById('searchInput');

  function applyFilters() {
    var dorms=document.querySelectorAll('.dorm-item'),query=searchInput?searchInput.value.toLowerCase():'';
    var types=getChecked(['En-Suite','Studio','Shared']),prices=getChecked(['budget','mid','premium']);
    var locs=getChecked(['dublin 1','dublin 2','dublin 4','dublin 6','dublin 8','dublin 9','dun laoghaire']);
    var unis=getChecked(['uni-tcd','uni-ucd','uni-tud','uni-dcu']),dists=getChecked(['dist-1','dist-2','dist-5']);
    var amens=getChecked(['wifi','bills','furnished','parking']),visible=0;
    dorms.forEach(function(d){
      var name=(d.getAttribute('data-name')||'').toLowerCase(),addr=(d.getAttribute('data-address')||'').toLowerCase();
      var type=d.getAttribute('data-type')||'',price=parseInt(d.getAttribute('data-price')||'0',10);
      var amen=(d.getAttribute('data-amenities')||'').toLowerCase().split(',');
      var uni=(d.getAttribute('data-university')||'').toLowerCase(),dist=parseFloat(d.getAttribute('data-distance')||'99');
      var ok=(!query||name.includes(query)||addr.includes(query))
        &&(types.length===0||types.indexOf(type)!==-1)
        &&(prices.length===0||prices.some(function(r){return r==='budget'?price<800:r==='mid'?price>=800&&price<=1000:price>1000;}))
        &&(locs.length===0||locs.some(function(l){return addr.includes(l);}))
        &&(unis.length===0||unis.some(function(u){return('uni-'+uni)===u;}))
        &&(dists.length===0||dists.some(function(x){return x==='dist-1'?dist<1:x==='dist-2'?dist<2:dist<5;}))
        &&(amens.length===0||amens.every(function(a){return amen.indexOf(a)!==-1;}));
      d.style.setProperty('display',ok?'block':'none','important');
      if(ok)visible++;
    });
    var c=document.getElementById('resultCount');if(c)c.textContent=visible+' properties found';
  }

  function getChecked(vals){var out=[];document.querySelectorAll('.filter-check:checked').forEach(function(cb){if(vals.indexOf(cb.value)!==-1)out.push(cb.value);});return out;}
  if(searchInput)searchInput.addEventListener('input',applyFilters);
  document.querySelectorAll('.filter-check').forEach(function(cb){cb.addEventListener('change',applyFilters);});
  window.resetFilters=function(){if(searchInput)searchInput.value='';document.querySelectorAll('.filter-check').forEach(function(cb){cb.checked=false;});applyFilters();};

  function applyPreFilters(){
    var pf=window._preFilter||{};
    if(pf.uni&&pf.uni!==''){var cb=document.querySelector('.filter-check[value="uni-'+pf.uni+'"]');if(cb)cb.checked=true;}
    if(pf.type&&pf.type!==''){var cb2=document.querySelector('.filter-check[value="'+pf.type+'"]');if(cb2)cb2.checked=true;}
    if(pf.search&&pf.search!==''){var si=document.getElementById('searchInput');if(si)si.value=pf.search;}
    if(pf.uni||pf.type||pf.search)applyFilters();
  }

  // Search button
  var sc=document.querySelector('.search-container');
  if(sc){var b=document.createElement('button');b.className='zh-search-btn';b.textContent='搜索';b.addEventListener('click',applyFilters);sc.appendChild(b);}

  // Make cards clickable and add hover ring
  document.querySelectorAll('.dorm-item').forEach(function(item,i){
    var card=item.querySelector('.listing-card');
    // Make title a link
    var titleEl=item.querySelector('.card-content h5');
    if(titleEl){var a=document.createElement('a');a.href='/info';a.className='zh-card-title-link';a.textContent=titleEl.textContent;titleEl.replaceWith(a);}
    // Make button a link
    var btn=item.querySelector('.btn-view-deal');
    if(btn){var al=document.createElement('a');al.href='/info';al.className='btn-view-deal';al.textContent='查看宿舍';btn.replaceWith(al);}
    // Click whole card
    if(card){card.style.cursor='pointer';card.addEventListener('click',function(){window.location.href='/info';});}
    item.addEventListener('mouseenter',function(){
      if(card){card.style.borderColor='#ff6633';card.style.boxShadow='0 0 0 2px rgba(255,102,51,0.2)';}
    });
    item.addEventListener('mouseleave',function(){
      if(card){card.style.borderColor='';card.style.boxShadow='';}
    });
  });

  applyPreFilters();
});