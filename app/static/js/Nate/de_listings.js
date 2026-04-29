/**
 * FILE:    de_listings.js
 * AUTHOR:  Nathaniel Christian Dedumo (C24380561)
 * PAGE:    Dormitory Listings — German Locale
 *
 * LAYOUT:  Trivago-inspired horizontal card list with full-width map banner
 *          and Amazon-style collapsible sidebar filter panel.
 *          Dark charcoal palette (#212529), structured, authoritative.
 *
 * CULTURAL DESIGN RATIONALE:
 *   Targets High UA + Individualist users (Karl, PoV 1):
 *
 *   Hypothesis 1 — Clear Mental Map / Immediate Feedback:
 *     Full-width map banner placed directly below search — Karl sees
 *     ALL dorm locations immediately before browsing any cards.
 *     Map centres on individual dorm on hover — visceral geographic
 *     confirmation before committing. "Entfernung zur Universität"
 *     (distance) shown on every card eliminates ambiguity.
 *     Results count always visible — Karl always knows where he stands.
 *
 *   Hypothesis 2 — Explicit Technical Specifications:
 *     Each card shows the full spec table from listings.html:
 *     room size (m²), distance to university (km), contract length
 *     (weeks), bills included/not. Objective data for Individualist
 *     users who prioritise personal needs over social context.
 *
 *   Verified Badge Colour Deviation:
 *     Green (#198754) used for "Bestes Angebot" deal badge rather than
 *     the Phase 1 blue/grey guideline — provides distinct visceral trust
 *     signalling required for High UA financial security decisions.
 *
 *   Layout deviation from group guidelines:
 *     Horizontal card layout (not vertical grid) — mirrors Trivago.ie
 *     which was the primary reference site for the German user analysis.
 *     Linear top-to-bottom flow suits High UA users who follow a
 *     predictable, step-by-step mental model.
 *
 * PRE-FILTER: Reads window._preFilter from listings.html (Flask URL params).
 */
document.addEventListener('DOMContentLoaded', function () {

  var searchInput=document.getElementById('searchInput');

  function applyFilters(){
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
  if(sc){var b=document.createElement('button');b.className='de-search-btn';b.textContent='Suchen';b.addEventListener('click',applyFilters);sc.appendChild(b);}

  // Map banner
  var sw=document.querySelector('.search-bar-wrapper'),mb=document.createElement('div');mb.className='de-map-banner';
  var dm=document.getElementById('dormMap');
  if(dm){mb.appendChild(dm);if(sw&&sw.nextSibling)sw.parentNode.insertBefore(mb,sw.nextSibling);}

  // Results bar
  var rb=document.createElement('div');rb.className='de-results-bar';
  var rc=document.getElementById('resultCount'),cc=rc?rc.cloneNode(true):document.createElement('span');
  cc.id='resultCount';if(rc)rc.id='resultCount-old';cc.className='de-results-count';
  var sv=document.createElement('div');sv.innerHTML='<span style="font-size:0.82rem;color:#6c757d;">Sortieren nach:</span><select class="de-sort-select"><option>Empfohlen</option><option>Preis: niedrig bis hoch</option><option>Preis: hoch bis niedrig</option><option>Bewertung</option><option>Entfernung zur Universität</option></select>';
  rb.appendChild(cc);rb.appendChild(sv);mb.insertAdjacentElement('afterend',rb);

  // Layout
  var deLayout=document.createElement('div');deLayout.className='de-layout';
  var sidebar=document.createElement('aside');sidebar.className='de-sidebar';
  var rst=document.createElement('button');rst.className='de-filter-reset';rst.textContent='✕ Filter zurücksetzen';
  rst.addEventListener('click',function(){document.querySelectorAll('.de-filter-check,.filter-check').forEach(function(cb){cb.checked=false;});applyFilters();});
  sidebar.appendChild(rst);

  document.querySelectorAll('.filter-bar-wrapper .dropdown').forEach(function(dd){
    var te=dd.querySelector('.filter-pill'),items=dd.querySelectorAll('.dropdown-item');
    if(!te||!items.length)return;
    var sec=document.createElement('div');sec.className='de-filter-section';
    var hdr=document.createElement('div');hdr.className='de-filter-header';
    hdr.innerHTML=te.textContent.trim()+' <span class="de-chevron">▾</span>';
    hdr.addEventListener('click',function(){var bdy=hdr.nextElementSibling;var col=bdy.style.display==='none';bdy.style.display=col?'block':'none';hdr.classList.toggle('collapsed',!col);});
    var bdy=document.createElement('div');bdy.className='de-filter-body';
    items.forEach(function(it){
      var cb=it.querySelector('input[type="checkbox"]');if(!cb)return;
      var row=document.createElement('label');row.className='de-filter-item';
      row.innerHTML='<div class="de-filter-left"><input type="checkbox" class="de-filter-check filter-check" value="'+cb.value+'"><span class="de-filter-label">'+it.textContent.trim()+'</span></div>';
      var ncb=row.querySelector('input');
      ncb.addEventListener('change',function(){cb.checked=ncb.checked;cb.dispatchEvent(new Event('change',{bubbles:true}));applyFilters();});
      bdy.appendChild(row);
    });
    sec.appendChild(hdr);sec.appendChild(bdy);sidebar.appendChild(sec);
  });
  deLayout.appendChild(sidebar);

  // Cards
  var deListings=document.createElement('div');deListings.className='de-listings';
  var dormItems=document.querySelectorAll('.dorm-item');
  dormItems.forEach(function(item,i){
    var card=item.querySelector('.listing-card');if(!card)return;
    var img=card.querySelector('.card-image img'),badge=card.querySelector('.badge');
    var title=card.querySelector('.card-content h5'),address=card.querySelector('.card-content .small');
    var score=card.querySelector('.rating-score'),lbl=card.querySelector('.rating-label');
    var revs=card.querySelector('.rating-reviews'),price=card.querySelector('.price-amount'),per=card.querySelector('.price-per');
    var specs=card.querySelector('.de-card-specs');
    var specsHTML=specs?specs.outerHTML.replace('de-card-specs','de-specs'):'';
    var dist=item.getAttribute('data-distance')||'';
    var amenStr=item.getAttribute('data-amenities')||'';
    var tagHTML=amenStr.split(',').filter(Boolean).map(function(a){var l={wifi:'WiFi',bills:'Nebenkosten inkl.',furnished:'Möbliert',parking:'Parkplatz'};return'<span class="de-hcard-tag">'+(l[a.trim()]||a)+'</span>';}).join('');

    var wrapper=document.createElement('div');wrapper.className='de-hcard-wrapper dorm-item';wrapper.style.cursor='pointer';
    Array.from(item.attributes).forEach(function(a){if(a.name.startsWith('data-'))wrapper.setAttribute(a.name,a.value);});

    wrapper.innerHTML='<div class="de-hcard"><div class="de-hcard-img"><span class="de-badge">'+(badge?badge.textContent.trim():'')+'</span><img src="'+(img?img.src:'')+'" alt="'+(title?title.textContent.trim():'')+'"></div><div class="de-hcard-body"><div><a href="/info" class="de-hcard-title">'+(title?title.textContent.trim():'')+'</a><div class="de-hcard-address">📍 '+(address?address.textContent.replace('📍','').trim():'')+' </div>'+(dist?'<div class="de-hcard-dist"><i class="fa fa-walking"></i> '+dist+' km zur Universität</div>':'')+'<div class="de-hcard-tags">'+tagHTML+'</div>'+specsHTML+'</div><div class="de-hcard-rating"><span class="de-rating-score">'+(score?score.textContent.trim():'')+'</span><span class="de-rating-label">'+(lbl?lbl.textContent.trim():'')+'</span><span class="de-rating-reviews">'+(revs?revs.textContent.trim():'')+'</span></div></div><div class="de-hcard-aside"><div><span class="de-price-from">Ab</span><span class="de-price-amount">'+(price?price.textContent.trim():'')+'</span><span class="de-price-per">'+(per?per.textContent.trim():'')+'</span><span class="de-deal-badge">✓ Bestes Angebot</span></div><a href="/info" class="de-view-btn">Unterkunft ansehen →</a></div></div>';

    wrapper.addEventListener('click',function(){window.location.href='/info';});
    wrapper.addEventListener('mouseenter',function(){wrapper.querySelector('.de-hcard').style.borderColor='#212529';});
    wrapper.addEventListener('mouseleave',function(){wrapper.querySelector('.de-hcard').style.borderColor='';});
    deListings.appendChild(wrapper);
    item.style.display='none';
  });

  deLayout.appendChild(deListings);
  rb.insertAdjacentElement('afterend',deLayout);

  var observer=new MutationObserver(function(){
    dormItems.forEach(function(item,i){var w=deListings.querySelectorAll('.de-hcard-wrapper')[i];if(w)w.style.setProperty('display',item.style.display==='none'?'none':'block','important');});
    var oc2=document.getElementById('resultCount-old');if(oc2)cc.textContent=oc2.textContent;
  });
  dormItems.forEach(function(item){observer.observe(item,{attributes:true,attributeFilter:['style']});});

  applyPreFilters();
});