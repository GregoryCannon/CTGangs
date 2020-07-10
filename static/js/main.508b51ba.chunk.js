(this.webpackJsonpctgangs=this.webpackJsonpctgangs||[]).push([[0],[,,,,,,,,function(e,t,a){"use strict";var n=this&&this.__spreadArrays||function(){for(var e=0,t=0,a=arguments.length;t<a;t++)e+=arguments[t].length;var n=Array(e),l=0;for(t=0;t<a;t++)for(var r=arguments[t],i=0,s=r.length;i<s;i++,l++)n[l]=r[i];return n};t.__esModule=!0,t.getPairings=void 0;var l=a(18),r={id:-1,name:"dummy player",rating:-1,gangName:""};function i(e,t){return Math.abs(e.rating-t.rating)<=200}function s(e,t){t.benchedPlayers.push({playerData:e,legalSubstitutions:[]})}function c(e,t){for(var a=0,n=t.pairs;a<n.length;a++){var l=n[a];if(l.aPlayer.id===e.id)return l.bPlayer;if(l.bPlayer.id===e.id)return l.aPlayer}console.log("No opponent found for",e.name,"id:",e.id)}t.getPairings=function(e,t){for(;e.length<t.length;)e.push(r);for(;t.length<e.length;)t.push(r);for(var a=function(e,t){return e.map((function(e){return t.map((function(t){return i(e,t)?Math.abs(t.rating-e.rating):1e4}))}))}(e,t),u=l(a),o={pairs:[],benchedPlayers:[]},g=0,d=u;g<d.length;g++){var h=d[g],m=e[h[0]],f=t[h[1]];m==r?s(f,o):f==r?s(m,o):i(m,f)?o.pairs.push({aPlayer:m,bPlayer:f}):(s(m,o),s(f,o))}for(var p=function(a){for(var l=0,r=n(e,t).filter((function(e){return e.gangName===a.playerData.gangName}));l<r.length;l++){var s=r[l],u=c(s,o);a.playerData.gangName==s.gangName&&void 0!==u&&i(a.playerData,u)&&a.legalSubstitutions.push(s)}},b=0,y=o.benchedPlayers;b<y.length;b++){p(y[b])}return o}},function(e,t,a){"use strict";t.__esModule=!0,t.fetchSpreadsheetData=void 0;var n=a(21);function l(e){n("https://docs.google.com/spreadsheets/u/0/d/1lSTbhpqodhqQn7Dg5cN-lcBavdOuimGOKFMg9tVhIMA/gviz/tq?tqx=out:html&tq&gid=1540266327").then((function(e){return e.text()})).then((function(t){e(function(e){var t=e,a=(t=(t=(t=(t=(t=(t=(t=t.replace(/\r?\n|\r/g,"")).replace(/<tr style="background-color: #f0f0f0">/g,"<tr>")).replace(/<tr style="background-color: #ffffff">/g,"<tr>")).replace(/<td align="right">/g,"<td>")).replace(/<\/tr>/g,"")).split("@ Join</td>")[1]).split("</table></body>")[0]).split("<tr>").filter((function(e){return e.length>0})).map((function(e){return e.split(/<td>|<\/td><td>|<\/td>/).slice(1)}));return a=a.filter((function(e){return"&nbsp;"!==e[1]}))}(t).map((function(e){return{id:e[0],name:e[1],gangName:e[4],rating:e[9]}})))}))}t.fetchSpreadsheetData=l,l((function(e){console.log(e)}))},,function(e,t,a){e.exports=a(22)},,,,,function(e,t,a){},function(e,t,a){},,function(e,t,a){},function(e,t,a){},,function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(7),i=a.n(r),s=(a(16),a(2)),c=a(3),u=a(1),o=a(5),g=a(4),d=(a(17),a(8));a(19);function h(e){return console.log("ResultDisplay props",e),l.a.createElement("div",{className:"result-container"},l.a.createElement("h2",{id:"result-title"},"Results"),l.a.createElement("h3",{className:"result-section-title"},"Matches"),e.result.pairs.length>0?l.a.createElement("table",{id:"matches-table"},l.a.createElement("tbody",null,e.result.pairs.map((function(e){return l.a.createElement("tr",null,l.a.createElement("td",null,e.aPlayer.name+" vs. "+e.bPlayer.name))})))):l.a.createElement("em",null,"No matches possible!"),e.result.benchedPlayers.length>0?l.a.createElement("div",null,l.a.createElement("h3",{className:"result-section-title"},"Benched Players"),l.a.createElement("table",null,l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"Player"),l.a.createElement("th",null,"Gang"),l.a.createElement("th",null,"Could Sub For"))),l.a.createElement("tbody",null,e.result.benchedPlayers.map((function(e){return l.a.createElement("tr",null,l.a.createElement("td",null,e.playerData.name),l.a.createElement("td",null,e.playerData.gangName),l.a.createElement("td",null,e.legalSubstitutions.length>0?e.legalSubstitutions.map((function(e){return l.a.createElement("div",null,e.name)})):l.a.createElement("em",null,"None possible")))}))))):l.a.createElement("div",null))}var m=a(10),f=(a(20),a(9)),p=function(e){Object(o.a)(a,e);var t=Object(g.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={challengingGangPlayersText:"",defendingGangPlayersText:"",statusText:""},n.handleDefendingGangPlayersChanged=n.handleDefendingGangPlayersChanged.bind(Object(u.a)(n)),n.handleChallengingGangPlayersChanged=n.handleChallengingGangPlayersChanged.bind(Object(u.a)(n)),n.handleSubmit=n.handleSubmit.bind(Object(u.a)(n)),n}return Object(c.a)(a,[{key:"handleChallengingGangPlayersChanged",value:function(e){this.setState({challengingGangPlayersText:e.target.value})}},{key:"handleDefendingGangPlayersChanged",value:function(e){this.setState({defendingGangPlayersText:e.target.value})}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),Object(f.fetchSpreadsheetData)((function(e){console.log("\n\n Spreadsheet player data:",e);var a=t.filterPlayerData(t.state.challengingGangPlayersText,e),n=t.filterPlayerData(t.state.defendingGangPlayersText,e);t.props.submitFunction(a,n)}))}},{key:"filterPlayerData",value:function(e,t){var a,n=e.split(/\n|,/).filter((function(e){return e.length>0})),l=[],r=[],i=Object(m.a)(n);try{var s=function(){var e=a.value,n=t.filter((function(t){return t.name.trim().toUpperCase()===e.trim().toUpperCase()}));1===n.length?l.push(n[0]):r.push(e)};for(i.s();!(a=i.n()).done;)s()}catch(c){i.e(c)}finally{i.f()}return r.length>0&&this.setState({statusText:"Unable to find spreadsheet data for: "+r.join(", ")}),l}},{key:"render",value:function(){return l.a.createElement("div",{className:"form-container"},l.a.createElement("p",{id:"status-text"},this.state.statusText),l.a.createElement("form",{id:"main-form",onSubmit:this.handleSubmit},l.a.createElement("div",{className:"main-label"},"Participants from Challenging Gang"),l.a.createElement("div",{className:"secondary-label"},"Put newlines or commas between names"),l.a.createElement("textarea",{className:"participant-list-textarea",onChange:this.handleChallengingGangPlayersChanged}),l.a.createElement("div",{className:"main-label"},"Participants from Defending Gang"),l.a.createElement("div",{className:"secondary-label"},"Put newlines or commas between names"),l.a.createElement("textarea",{className:"participant-list-textarea",onChange:this.handleDefendingGangPlayersChanged}),l.a.createElement("input",{id:"submit-button",type:"submit",value:"Get Matches!"})))}}]),a}(n.Component),b={pairs:[],benchedPlayers:[]},y=function(e){Object(o.a)(a,e);var t=Object(g.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={result:b},n.handleSubmit=n.handleSubmit.bind(Object(u.a)(n)),n}return Object(c.a)(a,[{key:"handleSubmit",value:function(e,t){var a=Object(d.getPairings)(e,t);this.setState({result:a})}},{key:"render",value:function(){return l.a.createElement("div",{className:"App"},l.a.createElement("header",{className:"App-header"},l.a.createElement("p",null,"Welcome to Classic Tetris Gangs!")),l.a.createElement("div",{id:"page-body"},l.a.createElement(p,{submitFunction:this.handleSubmit}),this.state.result==b?l.a.createElement("div",null):l.a.createElement("div",null,l.a.createElement(h,{result:this.state.result}))))}}]),a}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(y,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[11,1,2]]]);
//# sourceMappingURL=main.508b51ba.chunk.js.map