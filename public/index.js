document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("copyright-year")?.replaceWith(new Text(new Date().getFullYear()));
	document.body.normalize();
	main();
}, {once: true, passive: true, capture: false});

const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastTrigger.addEventListener('click', () => {
	// main();
	document.getElementById('back').click();
	document.getElementById('ahead').click();
    toastBootstrap.show()
  })
}

$( ".carousel" ).hover(
	function() {
		$( "#"+this.id ).carousel({
			interval: 2000,
			pause: 'none' // disable default option "pause on hover" and set it to none
		});
	}, function() {
		$( "#"+this.id ).carousel('pause'); // to set it manually on a specific carousel id 
	}
);

function main() {
    const nbrWks = 7;
    var startDate = new Date();

    var backward = document.getElementById('back');
    backward.addEventListener('click', (e) => {
        startDate = startDate.addDays(-7);
        createCalendar(startDate, nbrWks);
    });
    backward.addEventListener('mouseenter', (e) => {
        e.target.style.cursor = 'pointer';
    });
    backward.addEventListener('mouseleave', (e) => {
        e.target.style.cursor = 'default';
    });
    var forward = document.getElementById('ahead');
    forward.addEventListener('click', (e) => {
        startDate = startDate.addDays(7);
        createCalendar(startDate, nbrWks);
    });
    forward.addEventListener('mouseenter', (e) => {
        e.target.style.cursor = 'pointer';
    });
    forward.addEventListener('mouseleave', (e) => {
        e.target.style.cursor = 'default';
    });

    createCalendar(startDate, nbrWks);

}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
function createCalendar(startDate, nbrWeeks) {

	var table = document.getElementById('calbody');
    removeAllChildNodes(table);

    //#region date functions
    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    function yyyyMMdd(d) {
        var getYear = d.toLocaleString("default", { year: "numeric" });
        var getMonth = d.toLocaleString("default", { month: "2-digit" });
        var getDay = d.toLocaleString("default", { day: "2-digit" });
        return getYear + "-" + getMonth + "-" + getDay;
	}
    Date.prototype.sameDay = function(d) {
        return this.getFullYear() === d.getFullYear()
        && this.getDate() === d.getDate()
        && this.getMonth() === d.getMonth();
	}
    //#endregion

    var now = new Date();
    const thisWkStart = now.addDays(-now.getDay());
    // # of days ahead you can select/book the week
    // negative value would mean can accept x days into current week
	var start = startDate.addDays(-startDate.getDay());
	console.log(start);
    var days = {};
    var dayIndx = 0;
    for(var wkNbr = 0; wkNbr < nbrWeeks; wkNbr++) {
        
        days[wkNbr] = [];

        var tr = document.createElement('tr');
        tr.id = `row_${wkNbr}`;

        tr.addEventListener('mouseenter', (e) => {
            e.target.style.backgroundColor = 'gainsboro';
        });
        tr.addEventListener('mouseleave', (e) => {
            var rwIndx = parseInt(e.target.id.split('_')[1]);
            var row = days[rwIndx];
            let daysOfWk = row.filter(td => td.id == yyyyMMdd(now));
            e.target.style.backgroundColor = daysOfWk.length == 0 ? 'transparent' : 'rgba(39, 196, 245, 0.3)';
        });
        tr.addEventListener('click', (e) => {
            var rwIndx = -1;
            if (e.target.nodeName == 'LABEL') {
                // do nothing since clicking the label fires the checkbox clicked event
                // event fires twice... first on the label click, second on the checkbox click
                rwIndx = parseInt(e.target.id.split('_')[1]);
            }
            else if (e.target.nodeName == 'INPUT') {
                // chkbx clicked
                rwIndx = parseInt(e.target.id.split('_')[1]);
            }
            else {
                for (const [key, value] of Object.entries(days)) {
                    value.forEach((dy) => {
                        if(e.target.id === dy.id) {
                            rwIndx = key;
                        }
                    });
                }
            }
            var chkbx = document.getElementById(`chkbx_${rwIndx}`);
            if(chkbx.disabled) {
                $('#calendarModal').modal('show');
            }
            else if (e.target.nodeName == 'TD') {
                chkbx.checked = !chkbx.checked;
            }
        });

        var td_chk = document.createElement('td');

        // creating checkbox element
        var checkbox = document.createElement('input');
    
        // Assigning the attributes
        // to created checkbox
        checkbox.type = "checkbox";
        checkbox.name = "name";
        checkbox.value = "value";
        checkbox.id = `chkbx_${wkNbr}`;
        checkbox.style.marginLeft = '5px';
        checkbox.autocomplete = 'off';
            
        // creating label for checkbox
        var label = document.createElement('label');
        label.id = `lbl_${wkNbr}`;
            
        // assigning attributes for
        // the created label tag
        label.htmlFor = checkbox.id;
            
        // appending the created text to
        // the created label tag
        label.appendChild(document.createTextNode(`week ${1 + wkNbr}`));
        label.style.marginLeft = '5px';
            
        // appending the checkbox
        // and label to div
        td_chk.appendChild(checkbox);
        td_chk.appendChild(label);
        td_chk.style.minWidth = '120px';
        td_chk.style.textAlign = 'left';
        table.appendChild(tr);
        tr.appendChild(td_chk);
       
        var pass1 = false;
        var willPass1 = false;
        for(var i = 0; i < 7; i++) {
            var day = start.addDays(dayIndx++);
            var dayNbr = day.getDate();
            var td_day = document.createElement('td');
            var weekStart = day.addDays(-i);
            td_day.id = yyyyMMdd(day);
            td_day.innerText = dayNbr;
            td_day.Date = day;

            //#region month borders
            if(i == 0) {
                td_day.style.borderLeftWidth = '2px';
            }
            else if(i == 6) {
                td_day.style.borderRightWidth = '2px';
            }
            if(dayNbr === 1) {
                pass1 = true;
                willPass1 = false;
                const month = day.toLocaleString('default', { month: 'long' });
                td_day.innerText = `${month.substr(0, 3)} ${dayNbr}`;
                td_day.style.borderLeftWidth = '3px';
            }
            // if day# at end of week < day#
            else if(day.addDays(7 - i).getDate() < dayNbr) {
                willPass1 = true;
            }
            if(pass1) {
                td_day.style.borderTopWidth = '3px';
            }
            if(willPass1) {
                td_day.style.borderBottomWidth = '3px';
            }
            //#endregion

            if(day.sameDay(now)) {
                td_day.style.backgroundColor = 'rgba(39, 196, 245, 0.3)';
                tr.style.backgroundColor = 'rgba(39, 196, 245, 0.2)';
            }
            if(weekStart.addDays(0) < thisWkStart) {
                checkbox.disabled = true;
            }

            days[wkNbr].push(td_day);
            tr.appendChild(td_day);
        }
    }
}