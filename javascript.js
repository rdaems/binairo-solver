
var d = [];
/*
var d = [
[2,2,2,2,2,2,2,1,0,2,2,1,2,0],
[2,2,2,2,2,2,2,1,0,2,1,0,2,1],
[2,2,2,2,2,0,1,0,1,0,0,1,0,1],
[2,2,1,2,0,2,2,1,2,2,0,1,1,0],
[2,2,0,2,2,2,0,2,2,2,1,0,0,1],
[2,2,1,2,2,0,1,2,0,2,2,0,1,0],
[0,2,2,0,1,1,0,1,1,0,1,1,0,0],
[2,2,2,2,0,1,1,0,1,2,0,1,0,1],
[1,1,0,1,1,0,1,0,0,1,0,0,1,0],
[2,0,2,2,0,1,0,1,0,0,1,0,1,1],
[0,1,1,0,1,0,1,0,1,1,0,1,0,0],
[1,2,2,1,0,0,1,1,0,0,1,1,0,0],
[0,2,2,0,1,1,0,0,1,1,0,0,1,1],
[2,2,1,2,2,1,0,0,1,0,1,0,1,1]];
*/
var n = d.length;

function data(i,j) {
	var v = d[i][j];
	if (v > 1) return ''; else return v;
};

function edit(i,j,v) {
	document.getElementById('tabel').childNodes[i].childNodes[j].innerText = v;
};

function setvalueonclick(i,j) {
	var v = (d[i][j]+1)%3;
	d[i][j] = v;
	edit(i,j,(v<2)?v:'');
	
};

function sit(m,ix,jx) {
	//console.log('sit called on ['+ix+','+jx+'].');	
	for (var k=0;k<2;k++) {
		m[ix][jx] = k;
		edit(ix,jx,k);
		if (correct(m,ix,jx)) {
		//0 might be correct, iterate further.
			for (var i=0;i<n;i++) {
				for (var j=0;j<n;j++) {
					if (m[i][j]==2) {
						var v = sit(m,i,j);
						if (v==2) {		//IMPORTANT neither 0 or 1 worked, we have to go one step back.
							m[i][j] = 2;
							edit(i,j,'?');
							i = n+1;
							j = n+1;
						} else {
							m[i][j] = v;
							edit(i,j,v);
							return k;
						};
					};
				};
			};
			if (i==n) {		//VALUE IS CORRECT
				return k;
			}
		};
	};
	return 2;
}

function samethree(a,b,c) {
	if (a==2 || b==2 || c==2) return false;
	if (a==b && b==c) return true;
	return false;
};

function correct(m,ix,jx) {
	//console.log('correct called on ['+ix+','+jx+'].');
	//console.table(m);
	var c = [0,0];	//count var for same values in row/column (shouldn't exceed n/2)
	var v = [2,2];	//value var for checking three in a row
	var p = [0,0];	//counting var for checking three in a row
	var vx = m[ix][jx];
	for (var i=0;i<n;++i) {
		for (var j=0;j<2;++j) {	//j=0:checking rows/j=1:checking columns
			var mij = m[j?i:ix][j?jx:i];
			c[j] = c[j] + (mij==vx);
			p[j] = (mij==2)?0:(p[j]+1)*(mij==v[j]);
			v[j] = mij;
			//console.log('['+(j?i:ix)+','+(j?jx:i)+'] '+(j?'col':'row')+' '+c[j]+' '+p[j]);
			if (c[j]>n/2||p[j]>1) {return false};
		};
	};
	return true;
};

function correctALL(m) {
	//check rows & columns
	var r0 = Array.apply(null, Array(n)).map(Number.prototype.valueOf,0);
	var r1 = Array.apply(null, Array(n)).map(Number.prototype.valueOf,0);
	var c0 = Array.apply(null, Array(n)).map(Number.prototype.valueOf,0);
	var c1 = Array.apply(null, Array(n)).map(Number.prototype.valueOf,0);
	for (var i=0;i<n;i++) {
		for (var j=0;j<n;j++) {
			if(m[i][j]==0) {
				r0[i]++;
				c0[j]++;
			} else if(m[i][j]==1) {
				r1[i]++;
				c1[j]++;
			}
			if (r0[i]>n/2 || c0[j]>n/2 || r1[i]>n/2 || c1[j]>n/2) {
				//console.log(r0,r1,c0,c1);
				return false;
			};
		};
	};
	//check three in a row
	for (var i=0;i<n;i++) {
		for (var j=0;j<n-2;j++) {
			//row
			if (samethree(m[i][j],m[i][j+1],m[i][j+2])) return false;
			//column
			if (samethree(m[j][i],m[j+1][i],m[j+2][i])) return false;
		};
	};
	//equal rows/columns...
	//no errors
	return true;
};

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

window.onload = build;
function build() {
	n = getUrlVars()['n']||14;
	var output = '';
	for (var i=0;i<n;i++) {
		d[i] = [];
		output += '<div>';
		for (var j=0;j<n;j++) {
			d[i][j] = 2;
			output += '<div id="w" class="w" onclick="setvalueonclick('+i+','+j+')">'+data(i,j)+'</div>';
		}
		output += '</div>';
	};
	document.getElementById('tabel').innerHTML = output;
	//window.alert(correct(d,0,1));
	};

function solve() {
	if (!correctALL(d)) {alert('Unable to solve: errors in inital setup.'); return 'error'};
	for (var i=0;i<n;i++) {
		for (var j=0;j<n;++j) {
			if (d[i][j]==2) {
				//var value = sit(d,i,j);
				//d[i][j] = value;
				edit(i,j,d[i][j] = sit(d,i,j));
			};
		};
	};
	if (!correctALL(d)) {alert('Unable to solve!')};
}



