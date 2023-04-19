/**
 * 쇼핑엔티
 */
scraper.shoppingnt = {
    // 로그인
    login: async function() {
        try {
            // 스크래퍼 데이터에서 로그인 계정 정보 가져오기
            var scraperData = await cAPI.getData();                                                   

            // 업체코드 입력
            var entpCode = await scraper.getElement("[name='entpCode']", 10000, 'Y');
            entpCode.val(scraperData.login.subAccountId);  

            // ID & PASSWORD 입력
            var id = await scraper.getElement("[name='userId']", 10000, 'Y');
            id.val(scraperData.login.accountId);        
                                                               
            var pw = await scraper.getElement("[name='passwd']", 10000, 'Y');
            pw.val(scraperData.login.accountPw);

            await cAPI.log('#### 로그인 완료 ####');
            await cAPI.resume();
        } 
        catch (error) {
            await cAPI.error(error.message);
        }
    },
    // 공지사항 닫기
    closeNotice: async function() {
        try {
            // 공지사항 갯수 만큼 닫기
            var div = await scraper.getElement('div:contains("위 내용 1주일간 노출하지 않음.")', 10000);
            if(div) {                                                                   
                for(i = 0; i < div.length; i++) {                           
                    if(div[i].style.color == 'black') {
                        div[i].click();
                        await cAPI.log('#### 공지사항 닫기 ####');
                    }
                }
            }
            await cAPI.resume();
        }
        catch (error) {
            await cAPI.error(error.message);
        }
    },
    // 택배건 주문 목록 다운로드
    getDOrderList: async function() {
        try {
            // 네모 버튼 클릭(메뉴 버튼)
            var square = await scraper.getElement('.ux-taskbar-clear-screen', 10000, 'Y');
            square[0].click();

            // 출고/배송완료등록 메뉴 클릭
            var menu = await scraper.getElement('span:contains("출고/배송완료등록")', 10000, 'Y');
            menu.click();

            // 교환 체크박스 클릭
            var exchange = await scraper.getElement('.x-form-checkbox', 10000, 'Y');
            exchange[1].click();

            // 검색 버튼 클릭
            var searchBtn = await scraper.getElement('[data-qtip="조회 [F8]"]', 10000, 'Y');
            searchBtn.click();

            // 주문이 있으면 엑셀 다운로드 버튼 클릭
            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregridpanel-"]')[4].id).store.getData().getRange().length > 0`, 10000);
            if(isCheck) {
                // 주문 다운로드
                var downloadBtn = await scraper.getElement('[data-qtip="Save As EXCEL"]', 10000, 'Y');
                downloadBtn.click();
            }
            else {
                scraper.setItem("dOrderList", '0');

                await cAPI.resume();
            }
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 설치건 주문 목록 다운로드
    getIOrderList: async function() {
        try {
            // 설치상품 라디오버튼 클릭
            var install = await scraper.getElement('.x-form-radio-default', 10000, 'Y');
            install[1].click();

            // 검색 버튼 클릭
            var searchBtn = await scraper.getElement('[data-qtip="조회 [F8]"]', 10000, 'Y');
            searchBtn.click();

            // 택배건 주문 갯수 가져오기
            var dOrderList = scraper.getItem("dOrderList");

            // 주문이 있으면 엑셀 다운로드 버튼 클릭
            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregridpanel-"]')[4].id).store.getData().getRange().length > 0`, 10000);
            if(isCheck) {
                // 주문 다운로드
                var downloadBtn = await scraper.getElement('[data-qtip="Save As EXCEL"]', 10000, 'Y');
                downloadBtn.click();
            }
            // 택배 주문, 설치 주문이 없으면 정상 메세지
            else if(!isCheck && dOrderList) {
                await cAPI.success('[200] 신규 주문이 없습니다.');
            }
            // 설치 주문이 없으면 종료
            else {
                await cAPI.resume();
            }
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 주문 확인할 리스트 정의하기
    setOrderList: async function() {
        try {
            // 스크래퍼 데이터 가져오기
            var scraperData = await cAPI.getData();

            // 택배, 설치 리스트
            var dOrderList = [], iOrderList = [];

            // 택배, 설치건 주문 정의
            for(var order of scraperData.orderList) {
                // 택배 주문(직송이라서 2)
                if(order.buyCls == '2' && !(order.cancelBuyStat)) {
                    dOrderList.push(order);
                }
                // 설치 주문
                else if(order.buyCls == '3' && !(order.cancelBuyStat)) {
                    iOrderList.push(order);
                }
            }

            // 택배, 설치건 주문 리스트 셋팅
            scraper.setItem('dOrderList', dOrderList);
            scraper.setItem('iOrderList', iOrderList);
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 주문 확인
    orderConfirm: async function() {
        try {
            // 네모 버튼 클릭(메뉴 버튼)
            var square = await scraper.getElement('.ux-taskbar-clear-screen', 10000, 'Y');
            square[0].click();

            // 출고/배송완료등록 메뉴 클릭
            var menu = await scraper.getElement('span:contains("출고/배송완료등록")', 10000, 'Y');
            menu.click();

            // 교환 체크박스 클릭
            var exchange = await scraper.getElement('.x-form-checkbox', 10000, 'Y');
            exchange[1].click();

            // 택배 / 설치 구분
            await scraper.shoppingnt.setOrderList();

            var dOrderList = await scraper.getItem("dOrderList");
            var iOrderList = await scraper.getItem("iOrderList");
            await cAPI.log(`##### 택배주문 : ${dOrderList.length}개, 설치주문 : ${iOrderList.length}개 #####`);

            // 택배 주문에 대한 주문 확인
            if(dOrderList.length > 0) {
                await cAPI.log("##### 택배 주문에 대한 주문 확인 시작 #####");

                // 검색 버튼 클릭
                var searchBtn = await scraper.getElement('[data-qtip="조회 [F8]"]', 10000, 'Y');
                searchBtn.click();

                await scraper.shoppingnt.orderChk(dOrderList);
            }
            // 설치 주문에 대한 주문 확인
            else if(iOrderList.length > 0) {
                await cAPI.log("##### 설치 주문에 대한 주문 확인 시작 #####");

                // 설치상품 라디오버튼 클릭
                var install = await scraper.getElement('.x-form-radio-default', 10000, 'Y');
                install[1].click();

                // 검색 버튼 클릭
                var searchBtn = await scraper.getElement('[data-qtip="조회 [F8]"]', 10000, 'Y');
                searchBtn.click();

                await scraper.shoppingnt.orderChk(iOrderList);
            }

            await cAPI.resume();
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 주문 확인 작업
    orderChk: async function(orderList) {
        var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregridpanel-"]')[4].id).store.getData().getRange().length > 0`, 10000);
        if(isCheck) {
            // SCM 그리드 데이터 가져오기
            var gridData = Ext.getCmp($('div[id^="cwaregridpanel-"]')[4].id).store.getData().getRange();

            // 일치하는 주문 찾아서 체크 및 successYn Y로 변경
            for(var order of orderList) {
                for(var i = 0; i < gridData.length; i++) {
                    if(order.val5 == gridData[i].data.PROCESS_NO) {
                        gridData[i].data.CHECK_YN = '1';
                        order.successYn = 'Y';
                        await scraper.delay(500);
                        break;
                    }
                }
            }

            await scraper.delay(2000);

            // 출고예정일 오늘 + 2일로 변경
            var today = await scraper.addDays(2, '/');
            var outPlanDate = await scraper.getElement('[name="OUT_PLAN_DATE"]');
            outPlanDate.val(today).trigger('change');

            await scraper.delay(2000);

            // 출고예정일 버튼 클릭
            var dateBtn = await scraper.getElement('span:contains("출고예정일 적용")', 10000, 'Y');
            dateBtn.click();
            
            await scraper.delay(1500);

            // alert창의 확인 버튼 클릭
            var ok = await scraper.getElement('.x-btn-wrap-default-small', 10000, 'Y');
            ok[2].click();
            
            await scraper.delay(1500);

            // 지연사유등록 기타로 변경 & 지연사유등록 버튼 클릭
            var select = await scraper.getElement('.x-form-arrow-trigger-default', 10000, 'Y');
            select[2].click();

            await scraper.delay(1500);

            var selectChk = await scraper.getElement('li:contains("기타")', 10000, 'Y');
            selectChk.click();        

            await scraper.delay(1500);      

            var regBtn = await scraper.getElement('span:contains("지연사유등록")', 10000, 'Y');
            regBtn.click();
            
            await scraper.delay(1500);

            // alert창의 확인 버튼 클릭
            var ok = await scraper.getElement('.x-btn-wrap-default-small', 10000, 'Y');
            ok[2].click();
            
            await scraper.delay(1500);

            // 저장 버튼 클릭
            var saveBtn = await scraper.getElement('[data-qtip="저장 [F9]"]', 10000, 'Y');
            saveBtn.click();

            // 최종 저장 버튼 클릭
            var scraperAct = await cAPI.getCurAct();
            if(scraperAct.executeYn == 'Y') {
                var ok = await scraper.getElement('.x-btn-wrap-default-small', 10000, 'Y');
                ok[3].click();
            }

            // 성공 / 실패 여부 호출
            for(var order of orderList) {
                if(order.successYn == 'Y') {
                    await cAPI.setIsSuccessOrder(order.omsBuyNo, true, '[200] 성공');
                }
                else {
                    await cAPI.setIsSuccessOrder(order.omsBuyNo, false, `[400] 해당 주문을 찾을 수 없습니다.`); 
                }
            }
        }
    },
    // 발송처리
    delivery: async function() {
        try {
            // 네모 버튼 클릭(메뉴 버튼)
            var square = await scraper.getElement('.ux-taskbar-clear-screen', 10000, 'Y');
            square[0].click();

            // 출고/배송완료등록 메뉴 클릭
            var menu = await scraper.getElement('span:contains("출고/배송완료등록")', 10000, 'Y');
            menu.click();

            await scraper.delay(2000);

            // 출하지시로 변경
            var select = await scraper.getElement('.x-form-arrow-trigger-default', 10000, 'Y');
            select[0].click();
            var selectChk = await scraper.getElement('li:contains("출하지시")', 10000, 'Y');
            selectChk.click();

            // 운송장번호일괄등록 버튼 클릭
            var allTracking = await scraper.getElement('span:contains("운송장번호일괄등록")', 10000, 'Y');
            allTracking.click();

            // 택배/설치 구분
            await scraper.shoppingnt.setOrderList();

            var dOrderList = await scraper.getItem("dOrderList");
            var iOrderList = await scraper.getItem("iOrderList");
            await cAPI.log(`##### 택배주문 : ${dOrderList.length}개, 설치주문 : ${iOrderList.length}개 #####`);

            // 주문과 일치하는 배송사 선택
            var select = await scraper.getElement('.x-form-arrow-trigger-default', 10000, 'Y');
            select[4].click();
            await scraper.delay(2000);
            var selectChk = await scraper.getElement('.x-boundlist-item-delyEntp', 10000, 'Y');
            for(var curCompy of selectChk) {
                // 택배 주문에 대한 배송사
                if(dOrderList) {
                    if(curCompy.innerText == dOrderList[0].scmCurCompyCd) {
                        curCompy.click();
                        break;
                    }
                }
                // 설치 주문에 대한 배송사
                else {
                    if(curCompy.innerText == '자체배송(설치포함)') {
                        curCompy.click();
                        break;
                    }
                }
            }

            await cAPI.resume();
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 발송처리할 엑셀 만들고 업로드
    sendOrderUpload: async function() {
        try {
            // 택배, 설치 리스트 가져오기
            var dOrderList = scraper.getItem("dOrderList");
            var iOrderList = scraper.getItem("iOrderList");
            var orderList = [];

            // 택배 주문 엑셀 만들고 업로드
            if(dOrderList.length > 0) {
                // 택배 리스트를 orderList로 변환
                orderList = dOrderList;

                var excelData = scraper.convertExcelData2(dOrderList, ['val5', 'wayBillNo'], ['주문번호', '운송장번호'], 0);
                var uploadResult = await cAPI.upload(excelData);

                if(uploadResult) {
                    await cAPI.log("##### 택배 주문 엑셀 업로드 성공! #####");
                }
                else {
                    await cAPI.error('[400] 발송처리 업로드에 실패했습니다.');
                }
            }
            // 설치 주문 엑셀 만들고 업로드
            else if(iOrderList.length > 0) {
                // 설치 리스트를 orderList로 변환
                orderList = iOrderList;

                var excelData = scraper.convertExcelData2(iOrderList, ['val5', 'wayBillNo'], ['주문번호', '운송장번호'], 0);
                var uploadResult = await cAPI.upload(excelData);

                if(uploadResult) {
                    await cAPI.log("##### 설치 주문 엑셀 업로드 성공! #####");
                }
                else {
                    await cAPI.error('[400] 발송처리 업로드에 실패했습니다.');
                }
            }

            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregridpanel-"]')[6].id).store.getData().getRange().length > 0`, 10000);
            if(isCheck) {
                // SCM 그리드 데이터 가져오기
                var gridData = Ext.getCmp($('div[id^="cwaregridpanel-"]')[6].id).store.getData().getRange();

                // 업로드한 내용이 정상건이면 successYn을 Y로 변경, 정상건이 아니라면 등록불가 사유 입력
                for(var order of orderList) {
                    for(var i = 0; i < gridData.length; i++) {
                        if(gridData[i].data.CHECK_YN == '1' && order.val5 == gridData[i].data.PROCESS_NO) {
                            order.successYn = 'Y';
                            await scraper.delay(500);
                            break;
                        }
                        else if(gridData[i].data.CHECK_YN == '0' && order.val5 == gridData[i].data.PROCESS_NO) {
                            order.fail = gridData[i].data.FAIL;
                            await scraper.delay(500);
                            break;
                        }
                    }
                }
            }

            await scraper.delay(2000);

            // executeYn 가져오기
            var scraperAct = await cAPI.getCurAct();
            if(scraperAct.executeYn == 'Y') {
                // 저장 버튼 클릭
                var save = await scraper.getElement('span:contains("저장")', 10000, 'Y');
                save.click(); 

                await scraper.delay(2000);

                // 예 버튼 클릭
                var ok = await scraper.getElement('span:contains("예")', 10000, 'Y');
                ok.click();           

                // 확인 버튼 클릭
                var confirm = await scraper.getElement('span:contains("확인")', 10000, 'Y');
                confirm.click();
            }

            // 성공 / 실패 여부 호출
            for(var order of orderList) {
                if(order.successYn == 'Y') {
                    await cAPI.setIsSuccessOrder(order.omsBuyNo, true, '[200] 발송처리 완료하였습니다.');
                }
                else {
                    await cAPI.setIsSuccessOrder(order.omsBuyNo, false, `[400] 사유 :  ${order.fail}`); 
                }
            }
        }   
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 파일 업로드 체크
    chkUpload: async function() {
        try {
            // SCM 그리드 데이터 가져오기
            var gridData = Ext.getCmp($('div[id^="cwaregridpanel-"]')[6].id).store.getData().getRange();
            await cAPI.log(`#### 운송장 번호 일괄 등록할 엑셀 업로드 갯수 : ${gridData.length}개 ####`);
            
            // 업로드할 주문이 1건 이상이면
            if(gridData.length > 0) {
                await cAPI.log('파일열기 및 업로드 버튼 클릭 됨');
                scraper.nativeClickYn = 'Y';
            }
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 배송완료(설치품)
    successDelivery: async function() {
        try {
            // 네모 버튼 클릭(메뉴 버튼)
            var square = await scraper.getElement('.ux-taskbar-clear-screen', 10000, 'Y');
            square[0].click();

            // 출고/배송완료등록 메뉴 클릭
            var menu = await scraper.getElement('span:contains("출고/배송완료등록")', 10000, 'Y');
            menu.click();

            await scraper.delay(2000);

            // 출고로 변경
            var select = await scraper.getElement('.x-form-arrow-trigger-default', 10000, 'Y');
            select[0].click();
            var selectChk = await scraper.getElement('li:contains("출고")', 10000, 'Y');
            selectChk.click();

            // 교환 체크박스 클릭
            var exchange = await scraper.getElement('.x-form-checkbox', 10000, 'Y');
            exchange[1].click();

            // 검색 버튼 클릭
            var searchBtn = await scraper.getElement('[data-qtip="조회 [F8]"]', 10000, 'Y');
            searchBtn.click();

            // 스크래퍼 데이터 가져오기
            var scraperData = await cAPI.getData();

            // executeYn 가져오기
            var scraperAct = await cAPI.getCurAct();

            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregridpanel-"]')[4].id).store.getData().getRange().length > 0`, 10000);
            if(isCheck) {
                // SCM 그리드 데이터 가져오기
                var gridData = Ext.getCmp($('div[id^="cwaregridpanel-"]')[4].id).store.getData().getRange();

                // 일치하는 주문 찾아서 체크 및 successYn Y로 변경
                for(var order of scraperData.orderList) {
                    for(var i = 0; i < gridData.length; i++) {
                        if(order.val5 == gridData[i].data.PROCESS_NO) {
                            gridData[i].data.CHECK_YN = '1';
                            order.successYn = 'Y';
                            await scraper.delay(500);
                            break;
                        }
                    }
                }

                if(scraperAct.executeYn == 'Y') {
                    // 저장 버튼 클릭
                    var saveBtn = await scraper.getElement('[data-qtip="저장 [F9]"]', 10000, 'Y');
                    saveBtn.click();
                }
            }

            // 설공 / 실패 호출
            for(var order of scraperData.orderList) {
                if(order.successYn == 'Y') {
                    await cAPI.setIsSuccessOrder(order.omsBuyNo, true, '[200] 성공');
                }
                else {
                    await cAPI.setIsSuccessOrder(order.omsBuyNo, false, '[400] 실패'); 
                }
            }
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 반품 목록 다운로드(회수 지시)
    getReturnList: async function() {
        try {
            // 네모 버튼 클릭
            var square = await scraper.getElement('.ux-taskbar-clear-screen', 10000,  'Y');
            square[0].click();

            // 회수확정등록 메뉴 클릭 
            var menu = await scraper.getElement('span:contains("회수확정등록")', 10000, 'Y');
            menu.click();
            
            // 검색 버튼 클릭
            var searchBtn = await scraper.getElement('[data-qtip="조회 [F8]"]', 10000, 'Y');
            searchBtn.click();

            // 주문이 있으면 엑셀 다운로드 버튼 클릭
            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregridpanel-"]')[4].id).store.getData().getRange().length > 0`, 10000);
            if(isCheck) {
                // 주문 다운로드
                var downloadBtn = await scraper.getElement('[data-qtip="Save As EXCEL"]', 10000, 'Y');
                downloadBtn.click();
            }
            // 주문이 없으면 종료
            else {
                scraper.setItem("returnList", '0');

                await cAPI.resume();
            }
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 반품 목록 다운로드(회수지시전송)
    getReturnList2: async function() {
        try {
            // 현재상태 회수지시전송으로 변경
            var select = await scraper.getElement('.x-form-arrow-trigger-default', 10000, 'Y');
            select[0].click();
            await scraper.delay(1500);
            var selectChk = await scraper.getElement('li:contains("회수지시전송")', 10000, 'Y');
            selectChk.click();                                                                     

            // 검색 버튼 클릭
            var searchBtn = await scraper.getElement('[data-qtip="조회 [F8]"]', 10000, 'Y');
            searchBtn.click();

            // 회수지시건 가져오기
            var returnList = scraper.getItem('returnList');

            // 주문이 있으면 엑셀 다운로드 버튼 클릭
            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregridpanel-"]')[4].id).store.getData().getRange().length > 0`, 10000);
            if(isCheck) {
                // 주문 다운로드
                var downloadBtn = await scraper.getElement('[data-qtip="Save As EXCEL"]', 10000, 'Y');
                downloadBtn.click();
            }
            // 반품 주문이 1건도 없으면 종료
            else if(!isCheck && returnList) {
                await cAPI.success('[200] 반품 주문이 없습니다.');
            }
            else {
                await cAPI.resume();
            }
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 반품 확인 처리
    setReturnStat: async function() {
        try {
            // 네모 버튼 클릭
            var square = await scraper.getElement('.ux-taskbar-clear-screen', 10000,  'Y');
            square[0].click();

            // 회수확정등록 메뉴 클릭 
            var menu = await scraper.getElement('span:contains("회수확정등록")', 10000, 'Y');
            menu.click();

            // 현재상태 회수집하완료로 변경
            var select = await scraper.getElement('.x-form-arrow-trigger-default', 10000, 'Y');
            select[0].click();
            await scraper.delay(1500);
            var selectChk = await scraper.getElement('li:contains("회수집하완료")', 10000, 'Y');
            selectChk.click();                                                                     

            // 검색 버튼 클릭
            var searchBtn = await scraper.getElement('[data-qtip="조회 [F8]"]', 10000, 'Y');
            searchBtn.click();

            // 스크래퍼 데이터 가져오기
            var scraperData = await cAPI.getData();

            // executeYn 가져오기
            var scraperAct = await cAPI.getCurAct();

            // 주문이 1건 이상인지 체크
            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregridpanel-"]')[4].id).store.getData().getRange().length > 0`, 10000);
            if(isCheck) {
                // SCM 그리드 데이터 가져오기
                var gridData = Ext.getCmp($('div[id^="cwaregridpanel-"]')[4].id).store.getData().getRange();

                // 일치하는 데이처 찾아서 체크 및 successYn Y 처리
                for(var order of scraperData.returnList) {
                    for(var i = 0; i < gridData.length; i++) {
                        if(order.val5 == gridData[i].data.PROCESS_NO) {
                            gridData[i].data.CHECK_YN = '1';
                            order.successYn = 'Y';
                            await scraper.delay(500);
                            break;
                        }
                    }
                }
            }

            if(scraperAct.executeYn == 'Y') {
                // 저장 버튼 클릭
                var saveBtn = await scraper.getElement('[data-qtip="저장 [F9]"]', 10000, 'Y');
                saveBtn.click();
            }

            // 성공 / 실패 여부 호출
            for(var order of scraperData.returnList) {
                if(order.successYn == 'Y') {
                    await cAPI.setIsSuccessOrder(order.scmReturnSeq, true, '[200] 반품 확정에 성공했습니다.');
                }
                else {
                    await cAPI.setIsSuccessOrder(order.scmReturnSeq, false, '[400] 반품 확정에 실패했습니다.'); 
                }
            }

            await cAPI.resume();
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    }
};