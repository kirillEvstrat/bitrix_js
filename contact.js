function contact_init(bxsesion, contact_id, date){	
	
	var nameFieldAdrresCopyRun = "UF_CRM_1496303852";

	var fieldCopyToHomeAddr = "UF_CRM_1585641884";
	
	var nameFieldAdrresWorkCopyRun = "UF_CRM_1496308173";
	
	var addres_fact = [
		'UF_CRM_1507440792',
		'UF_CRM_1507440337',
		'UF_CRM_58D0FA7D03D49',
		'UF_CRM_58D0FA7D0C49F',
		'UF_CRM_58D0FA7D14BCB',
		'UF_CRM_58D0FA7D1C62B',
		'UF_CRM_58D0FA7D23FFA',
		'UF_CRM_58D0FA7D2BBAD',
		'UF_CRM_58D0FA7D337E1',
		'UF_CRM_58D0FA7D3BE80',
		'UF_CRM_58D0FA7D43CA8',
	]
	
	var addres_reg = [
		'UF_CRM_1507440826',
		'UF_CRM_58D0FA7D68A9C',
		'UF_CRM_58D0FA7D78AEF',
		'UF_CRM_1490953462',
		'UF_CRM_58D0FA7D88232',
		'UF_CRM_58D0FA7D9244D',
		'UF_CRM_58D0FA7D80724',
		'UF_CRM_58D0FA7D9AA65',
		'UF_CRM_58D0FA7DA2687',
		'UF_CRM_58D0FA7DAA1DE',
		'UF_CRM_58D0FA7DB2792',
	];
	
	
	var addres_work_ur = [
		'UF_CRM_1506931605',
		'UF_CRM_1506931610',
		'UF_CRM_1506931615',
		'UF_CRM_58D0FA7EAA2B8',
		'UF_CRM_1470728863',
		'UF_CRM_58D0FA7EB2C78',
		'UF_CRM_58D0FA7EBB2F7',
		'UF_CRM_58D0FA7EC3A10',
		'UF_CRM_58D0FA7ECD8A8',		
	];
	
	var addres_work_fact = [
		'UF_CRM_1506931566',
		'UF_CRM_1506931574',
		'UF_CRM_1506931579',
		'UF_CRM_1496308819',
		'UF_CRM_1496308837',
		'UF_CRM_1496308849',
		'UF_CRM_1496308858',
		'UF_CRM_1496308871',
		'UF_CRM_1496308880',
		
	];
	
	setPI();
	if(document.getElementsByName('UF_CRM_58D0FA7E5226A')[1]){
		document.getElementsByName('UF_CRM_58D0FA7E5226A')[1].onchange = function (){setPI();};
	}
		
	function setPI(){
		if(document.getElementsByName('UF_CRM_58D0FA7E5226A')[1] && document.getElementsByName('UF_CRM_58D0FA7E5226A')[1].checked == 1){
		document.getElementsByName('UF_CRM_58D0FA7E5226A')[0].value = 1;
		} else {
			document.getElementsByName('UF_CRM_58D0FA7E5226A')[0].value = 0;
		}
	}
	
	
	
	if(document.getElementsByName(nameFieldAdrresWorkCopyRun)[1] 
		&& document.getElementsByName(nameFieldAdrresWorkCopyRun)[1].checked){		
		copyAddresData(addres_work_ur, addres_work_fact);
		document.getElementById('section_5rtlq2wa_contents').style.display = 'none';
	} else {
		document.getElementById('section_5rtlq2wa_contents').style.display = 'block';
	}

	if(document.getElementsByName(fieldCopyToHomeAddr)[1]
		&& document.getElementsByName(fieldCopyToHomeAddr)[1].checked){
		console.log("checked");
		copyAddresData(addres_reg, addres_fact);
		document.getElementById('section_vccxpdvk_contents').style.display = 'none';
	} else {
		console.log("notchecked");
		document.getElementById('section_vccxpdvk_contents').style.display = 'block';
	}
	
	
	
	
	if(document.getElementsByName(nameFieldAdrresCopyRun)[1] 
		&& document.getElementsByName(nameFieldAdrresCopyRun)[1].checked){		
		copyAddresData(addres_fact, addres_reg);
		console.log("checked1");
		document.getElementById('section_ouvjt5lz_contents').style.display = 'none';
	} else {
		console.log("notchecked1");
		document.getElementById('section_ouvjt5lz_contents').style.display = 'block';
	}
	
	
	setHandlerCopyAdrresCheck();
	setHandlerCopyAdrresWorkCheck();
	setHandlerCopyRegCheck();
	
	setDealAisKbHistory();
	
	function setDealAisKbHistory(){
		BX.ajax({   
			url: '/local/ajax/client_data.php',
					method: 'POST',
					async: false,
					data: {action: 'get_deal_ais_kb', CONTACT_ID : contact_id, bxsesion : bxsesion},
					onsuccess: function(data){
						//alert(data);
						
						document.getElementById('uf_crm_1508917417_wrap').style.width = '750px';
						document.getElementsByName('UF_CRM_1508917417')[0].style.display = 'none';
						
						//document.getElementById('uf_crm_1508917417_wrap').getElementsByClassName('crm-offer-info-left')[0].style.display = 'none';


						if(document.getElementById('ais_element')) {
							var elem = document.querySelector('#uf_crm_1508917417_wrap .crm-offer-info-right').children[1];
							elem.remove();

							var newDiv = document.createElement('div');
							newDiv.id = 'ais_element';
							newDiv.innerHTML = data;

							document.querySelector('#uf_crm_1508917417_wrap .crm-offer-info-right').appendChild(newDiv);
						}
						else
						{
							var newDiv = document.createElement('div');
							newDiv.id = 'ais_element';
							newDiv.innerHTML = data;

							document.querySelector('#uf_crm_1508917417_wrap .crm-offer-info-right').appendChild(newDiv);
						}

						
					},
					onfailure: function(data, error){
						alert('false'+data+error);
					}
				});
	}
	
	function setHandlerCopyAdrresCheck(){
		if(document.getElementsByName(nameFieldAdrresCopyRun)[1]){
			var checkbox = document.getElementsByName(nameFieldAdrresCopyRun)[1];
			checkbox.onchange = function() {				
				if(this.checked) {
					copyAddresData(addres_fact, addres_reg);
					document.getElementById('section_ouvjt5lz_contents').style.display = 'none';
					setHandlerCopyAdrresFromTo(addres_fact, addres_reg);
				} else {
					document.getElementById('section_ouvjt5lz_contents').style.display = 'block';
					unSetHandlerCopyAdrresFromTo(addres_fact);
				}				
			}			
		}
	}

	function setHandlerCopyRegCheck(){
		if(document.getElementsByName(fieldCopyToHomeAddr)[1]){
			var checkbox = document.getElementsByName(fieldCopyToHomeAddr)[1];
			checkbox.onchange = function() {
				if(this.checked) {
					copyAddresData(addres_reg,addres_fact);
					document.getElementById('section_vccxpdvk_contents').style.display = 'none';
					setHandlerCopyAdrresFromTo(addres_reg, addres_fact );
				} else {
					document.getElementById('section_vccxpdvk_contents').style.display = 'block';
					unSetHandlerCopyAdrresFromTo(addres_reg);
				}
			}
		}
	}

	
	function setHandlerCopyAdrresWorkCheck(){
		if(document.getElementsByName(nameFieldAdrresWorkCopyRun)[1]){
			var checkbox = document.getElementsByName(nameFieldAdrresWorkCopyRun)[1];
			checkbox.onchange = function() {				
				if(this.checked) {
					copyAddresData(addres_work_ur, addres_work_fact);
					document.getElementById('section_5rtlq2wa_contents').style.display = 'none';
					setHandlerCopyAdrresWorkFromTo(addres_work_ur, addres_work_fact);
				} else {
					document.getElementById('section_5rtlq2wa_contents').style.display = 'block';
					unSetHandlerCopyAdrresWorkFromTo(addres_work_ur);
				}				
			}			
		}
	}
	
	
	function setHandlerCopyValue(nameFromCopy, nameToCopy){
		
		if(document.getElementsByName(nameFromCopy)[0] && document.getElementsByName(nameToCopy)[0]){
			var fromElem = document.getElementsByName(nameFromCopy)[0];
			var toElem = document.getElementsByName(nameToCopy)[0];
			fromElem.onchange = function() {
				toElem.value = fromElem.value;
			}
		}
		
		if(document.getElementsByName(nameFromCopy)[1] && document.getElementsByName(nameToCopy)[1]){
			var fromElem = document.getElementsByName(nameFromCopy)[1];
			var toElem = document.getElementsByName(nameToCopy)[1];
			fromElem.onchange = function() {
				toElem.value = fromElem.value;
			}
		}
	}
	
	function setHandlerCopyAdrresFromTo(arAdresFrom, arAdresTo) {
		for (var i = 0; i < arAdresFrom.length; i++ ) {
			setHandlerCopyValue(arAdresFrom[i], arAdresTo[i]);			
		}
	}
	
	function unSetHandlerCopyAdrresFromTo(arAdresFrom) {
		for (var i = 0; i < arAdresFrom.length; i++ ) {
			if(document.getElementsByName(arAdresFrom[i])[0]){
				document.getElementsByName(arAdresFrom[i])[0].onchange = false;
			}
			
			if(document.getElementsByName(arAdresFrom[i])[1]){
				document.getElementsByName(arAdresFrom[i])[1].onchange = false;
			}			
		}
	}
	
	
	function setHandlerCopyAdrresWorkFromTo(arAdresFrom, arAdresTo) {
		for (var i = 0; i < arAdresFrom.length; i++ ) {
			setHandlerCopyValue(arAdresFrom[i], arAdresTo[i]);			
		}
	}
	
	function unSetHandlerCopyAdrresWorkFromTo(arAdresFrom) {
		for (var i = 0; i < arAdresFrom.length; i++ ) {
			if(document.getElementsByName(arAdresFrom[i])[0]){
				document.getElementsByName(arAdresFrom[i])[0].onchange = false;
			}
			
			if(document.getElementsByName(arAdresFrom[i])[1]){
				document.getElementsByName(arAdresFrom[i])[1].onchange = false;
			}			
		}
	}
		
	
	function copyAddresData(arAdresFrom, arAdresTo) {
		for (var i = 0; i < arAdresFrom.length; i++ ) {
			copyValue(arAdresFrom[i], arAdresTo[i]);			
		}
	}
	
	
	function copyValue(nameFromCopy, nameToCopy){
		if(document.getElementsByName(nameFromCopy)[0] && document.getElementsByName(nameToCopy)[0]){
			document.getElementsByName(nameToCopy)[0].value = document.getElementsByName(nameFromCopy)[0].value;
		}
		if(document.getElementsByName(nameFromCopy)[1] && document.getElementsByName(nameToCopy)[1]){
			document.getElementsByName(nameToCopy)[1].value = document.getElementsByName(nameFromCopy)[1].value;
		}		
	}
	
	
	
	setDataFromLead(date.lead_id);
	
	function setDataFromLead(lead_id){
		var data = {
			action : "get_client_data",
			lead_id : lead_id
		};
		if(lead_id > 0) {
			BX.ajax.post('/local/ajax/client_data.php', data, function (arLead) {
				console.log(arLead);
				var arLead = JSON.parse(arLead);

				if(document.getElementsByName('UF_CRM_58D0FA7CA0341')[0]){
					document.getElementsByName('UF_CRM_58D0FA7CA0341')[0].value = arLead['UF_CRM_1540526852'];
				}


				if(document.getElementsByName('UF_CRM_58D0FA7CA7C4C')[0]){
					document.getElementsByName('UF_CRM_58D0FA7CA7C4C')[0].value = arLead['UF_CRM_1540526840'];
				}


				if(document.getElementsByName('UF_CRM_1494941469')[0]){
					document.getElementsByName('UF_CRM_1494941469')[0].value = arLead['UF_CRM_1540526892'];
				}


				if(document.getElementsByName('UF_CRM_58D0FA7CAF698')[0]){
					document.getElementsByName('UF_CRM_58D0FA7CAF698')[0].value = arLead['UF_CRM_1540526960'];
				}


				if(document.getElementsByName('UF_CRM_1490953462')[0]){
					document.getElementsByName('UF_CRM_1490953462')[0].value = arLead['UF_CRM_1540527111'];
				}


					//UF_CRM_1540526960
			});
		}
	}
	
}

