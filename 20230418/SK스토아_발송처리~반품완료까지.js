/**
 * SK스토아
 */
scraper.skstore = {
    // 인증번호 발신 번호
    authFromNo: '15660106',
    // 인증번호 수신 일자
    authDttm: null,
    // 로그인
    login : async function() {
        try {
            // 스크래퍼 데이터 가져오기
            var scraperData = await cAPI.getData();

            // 업체코드 입력
            var entpCode = await scraper.getElement('[name="entpCode"]', 10000, 'Y');
            entpCode.val(scraperData.login.subAccountId);
            
            // ID 입력
            var id = await scraper.getElement('[name="userId"]', 10000, 'Y');
            id.val(scraperData.login.accountId);

            // PW 입력
            var pw = await scraper.getElement('[name="passwd"]', 10000, 'Y');
            pw.val(scraperData.login.accountPw);

            // 로그인 버튼 클릭
            var loginBtn = await scraper.getElement(".x-btn-inner.x-btn-inner-default-small", 10000, 'Y');
            loginBtn[1].click();

            await scraper.delay(2000);

            // 핸드폰 인증 팝업이 뜨면 확인 버튼 클릭 후 인증 진행
            var certPop = await scraper.getElement('span:contains("확인")', 10000);
            certPop[0].click();

            // 인증번호 받기 버튼 클릭
            var getCert = await scraper.getElement('span:contains("인증번호 받기")', 10000);
            if(getCert) {
                await cAPI.log("##### 2차 인증 진행 #####");

                getCert[0].click();

                // 확인 버튼 클릭
                var okBtn = await scraper.getElement('span:contains("확인").x-btn-wrap.x-btn-wrap-default-small', 10000, 'Y');
                okBtn.click();
    
                // 인증번호 요청 시간 설정
                scraper.skstore.authDttm = new Date();
    
                await scraper.delay(5000);
    
                // 인증번호 입력
                var authNo = await scraper.getElement('[name="AUTH_NUMBER"]', 10000, 'Y');
    
                // 당일 인증요청한 인증번호 목록을 할당
                var auths = [];
    
                // 필터 처리한 인증번호
                var filterAuths = [];
    
                // 인증 요청한 시간 이후에 들어온 인증번호를 필터
                do {
                    auths = await cAPI.getAuthNo(scraperData.login.accountTel, scraper.skstore.authFromNo);
    
                    if(auths && auths.length > 0) {
                        // 인증번호 추출
                        filterAuths = auths.filter((auth) => {
                            var regDttm = new Date(auth.regDttm);
                                return scraper.skstore.authDttm <= regDttm;
                            });
                        } 
                        await scraper.delay(1000);
                    }
                    while(filterAuths.length <= 0);
    
                    // 인증 시도
                    for(var i = 0; i < filterAuths.length; i++) {
                        await cAPI.log(`#### 인증번호 : ${filterAuths[i].otherAuthCode} ####`);
                        authNo.val(filterAuths[i].otherAuthCode);
                    }
    
                    // 인증확인 버튼 클릭
                    var authNoOk = await scraper.getElement('span:contains("인증확인")', 10000, 'Y');
                    authNoOk[0].click();
                }
                else {
                    await cAPI.log("##### 중복 로그인 해제 #####");

                    // 중복 로그인으로 인해 팝업이 뜨면 예 버튼 클릭
                    var okBtn = await scraper.getElement('span:contains("예")', 10000);
                    okBtn.click();
                }

            await cAPI.resume();
        } 
        catch (error) {
            await cAPI.error('[403] 로그인 실패 ' +  error.message);
        }
    },
    // 공지사항 닫기
    closeNotice: async function() {
        try {
            // 공지사항 갯수만큼 닫기
            var closeBtn = await scraper.getElement('div[id^="popupPop"] .x-tool-close', 10000);
            if(closeBtn) {
                for(var i = 0; i < closeBtn.length; i++) {
                    closeBtn[i].click();
                    await cAPI.log("#### 공지사항 닫기 ####");
                }
            }
            await cAPI.resume();
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 출고/배송완료등록 메뉴로 이동
    moveOrder: async function() {
        try {
            // 출고/배송완료등록 메뉴로 이동
            var tab1 = await scraper.getElement(".ux-taskbar-clear-screen", 10000, 'Y');
            tab1[0].click();
            var menu = await scraper.getElement("span:contains('출고/배송완료등록')", 10000, 'Y');
            menu.click();

            // 교환 체크박스 클릭
            var exchangeBtn = await scraper.getElement('[name="gubun_claim"]', 10000, 'Y');
            exchangeBtn.click();

            await cAPI.resume();
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 주문 목록 다운로드
    getOrderList: async function() {
        try {
            // 조회 버튼 클릭
            var searchBtn = await scraper.getElement("[aria-label='조회 [F8]']", 10000, 'Y');
            searchBtn.click();

            // 주문이 있으면 엑셀 다운로드 버튼 클릭
            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregrid-"].x-panel.x-panel-default-framed.x-fit-item.x-grid')[0].id).store.getData().getRange().length > 0`, 10000);
            if(isCheck) {
                // 주문 다운로드
                var downloadBtn = await scraper.getElement("[aria-label='Save As EXCEL']", 10000, 'Y');
                downloadBtn.click();

                // 팝업에서 확인 버튼 클릭
                var okBtn = await scraper.getElement("span:contains('확인').x-btn-wrap.x-btn-wrap-default-small", 10000, 'Y');
                okBtn[0].click();

                // 사유 입력
                var reason = await scraper.getElement('[name="DOWN_REASON"]', 10000, 'Y');
                reason.val('OMS 업무');

                // 사유 입력 후 확인 버튼 클릭
                var okBtn2 = await scraper.getElement("span:contains('확인').x-btn-wrap.x-btn-wrap-default-small", 10000, 'Y');
                okBtn2[1].click();
            }
            else {
                await cAPI.success('[200] 신규 주문이 없습니다.');
            }
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 배송접수구분을 업체개별접수로 변경
    changeDelyProcGb: async function() {
        try {
            var delyProcGb = await scraper.getElement('[name="dely_proc_gb"]', 10000, 'Y');
            delyProcGb.click();
            await scraper.delay(2000);
            var company = await scraper.getElement('li:contains("업체개별접수")', 10000, 'Y');
            company.click();

            await cAPI.resume();
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 주문확인
    orderConfirm: async function() {
        try {
            // 스크래퍼 데이터 가져오기
            var scraperData = await cAPI.getData();

            // executeYn 가져오기
            var scraperAct = await cAPI.getCurAct();

            // 조회 버튼 클릭
            var searchBtn = await scraper.getElement("[aria-label='조회 [F8]']", 10000, 'Y');
            searchBtn.click();

            // 주문 1건 있으면 전체선택 클릭 후 저장 버튼 클릭
            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregrid-"].x-panel.x-panel-default-framed.x-fit-item.x-grid')[0].id).store.getData().getRange().length > 0`, 20000);
            if(isCheck) {
                // SCM 그리드 데이터 가져오기
                var gridData = Ext.getCmp($('div[id^="cwaregrid-"].x-panel.x-panel-default-framed.x-fit-item.x-grid')[0].id).store.getData().getRange();
                    
                // 일치하는 주문 찾아서 체크
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

                // 저장 버튼 클릭
                var saveBtn = await scraper.getElement('[aria-label="저장 [F9]"]', 10000, 'Y');
                if(scraperAct.executeYn == 'Y') {
                    await cAPI.log("#### 중요 프로세스 시작 ####");
                    saveBtn.click();
                }
            }

            // 배송접수구분을 업체개별접수로 변경
            var delyProcGb = await scraper.getElement('[name="dely_proc_gb"]', 10000, 'Y');
            delyProcGb.click();
            await scraper.delay(2000);
            var company = await scraper.getElement('li:contains("업체개별접수")', 10000, 'Y');
            company.click();

            // 조회 버튼 클릭
            var searchBtn = await scraper.getElement("[aria-label='조회 [F8]']", 10000, 'Y');
            searchBtn.click();

            await scraper.delay(3000);

            // 주문 1건 있으면 전체선택 클릭 후 저장 버튼 클릭
            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregrid-"].x-panel.x-panel-default-framed.x-fit-item.x-grid')[0].id).store.getData().getRange().length > 0`, 20000);
            if(isCheck) {
                // SCM 그리드 데이터 가져오기
                var gridData = Ext.getCmp($('div[id^="cwaregrid-"].x-panel.x-panel-default-framed.x-fit-item.x-grid')[0].id).store.getData().getRange();
                    
                // 일치하는 주문 찾아서 체크
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

                // 저장 버튼 클릭
                var saveBtn = await scraper.getElement('[aria-label="저장 [F9]"]', 10000, 'Y');
                if(scraperAct.executeYn == 'Y') {
                    await cAPI.log("#### 중요 프로세스 시작 ####");
                    saveBtn.click();
                }
            }

            // 성공 / 실패 여부 판단
            for(var order of scraperData.orderList) {
                if(order.successYn == 'Y') {
                    await cAPI.setIsSuccessOrder(order.omsBuyNo, true, '[200] 성공');
                }
                else {
                    await cAPI.setIsSuccessOrder(order.omsBuyNo, false, '[400] 해당 하는 주문을 찾지 못했습니다.');
                }
            }
        
            await cAPI.resume();
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 발송처리(검색 버튼을 클릭한 뒤에 진행해야 되는지? 아니면 바로 발송처리 진행해도 되는지??)
    delivery: async function() {
        try {
            // 대상을 출고로 변경
            var doFlag = await scraper.getElement('[name="do_flag"]', 10000, 'Y');
            doFlag.click();
            await scraper.delay(2000);
            var outBound = await scraper.getElement('li:contains("출고")', 10000, 'Y');
            outBound.click();

            // 출고일괄등록버튼 클릭
            var allBtn = await scraper.getElement('span:contains("출고일괄등록")', 10000, 'Y');
            allBtn[0].click();

            // 택배/설치 구분
            await scraper.skstore.setDeliveryList();

            var dOrderList = await scraper.getItem("dOrderList");
            var iOrderList = await scraper.getItem("iOrderList");
            await cAPI.log(`택배주문 : ${dOrderList.length}개, 설치주문 : ${iOrderList.length}개`);

            // 주문과 일치하는 배송사 선택
            var select = await scraper.getElement('[name="dely_entp"]', 10000, 'Y');
            select.click();
            await scraper.delay(2000);
            var selectChk = await scraper.getElement('.x-boundlist-item-delyEntp', 10000, 'Y');
            for(var curCompy of selectChk) {
                // 택배 주문에 대한 배송사
                if(dOrderList) {
                    if(curCompy.innerText == dOrderList[0].scmCurCompyCd) {
                        await cAPI.log(`#### 택배사 ${curCompy.innerText} 선택 ####`);
                        curCompy.click();
                        break;
                    }
                }
                // 설치 주문에 대한 배송사
                else if(iOrderList.length > 0)  {
                    if(curCompy.innerText == '') {
                        await cAPI.log(`#### 택배사 ${curCompy.innerText} 선택 ####`);
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
    // 발송처리할 리스트 정의하기
    setDeliveryList: async function() {
        try {
            // 스크래퍼 데이터 가져오기
            var scraperData = await cAPI.getData();

            // 택배, 설치 리스트
            var dOrderList = [], iOrderList = [];

            // 택배, 설치건 주문 정의
            for(var order of scraperData.orderList) {
                // 택배 주문
                if(order.buyCls == '1' && !(order.cancelBuyStat)) {
                    dOrderList.push(order);
                }
                // 설치 주문
                else if(order.buyCls == '3' && !(order.cancelBuyStat)) {
                    var today = await scraper.getToday();
                    order.wayBillNo = today;
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
    // 발송처리할 엑셀 만들고 업로드
    sendOrderUpload: async function() {
        try {
            // 택배, 설치 리스트 가져오기
            var dOrderList = scraper.getItem('dOrderList');
            var iOrderList = scraper.getItem('iOrderList');
            var orderList = [];

            // 택배 주문 엑셀 만들고 업로드
            if(dOrderList.length > 0) {
                // 택배 리스트를 orderList로 변환
                orderList = dOrderList;

                var excelData = scraper.convertExcelData2(dOrderList, ['val5', 'wayBillNo'], ['주문번호', '운송장번호'], 0);
                var uploadResult = await cAPI.upload(excelData);

                if(uploadResult) {
                    await cAPI.log("택배 주문 엑셀 업로드 성공!!!!");
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
                    await cAPI.log("설치 주문 엑셀 업로드 성공!!!!");
                }
                else {
                    await cAPI.error('[400] 발송처리 업로드에 실패했습니다.');
                }
            }

            // 주문건이 1건 이상인지 체크
            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="popupPopDelyOkProcExcel-"] .x-grid')[0].id).store.getData().getRange().length > 0`, 20000);
            if(isCheck) {
                // SCM 그리드 데이터 가져오기
                var gridData = Ext.getCmp($('div[id^="popupPopDelyOkProcExcel-"] .x-grid')[0].id).store.getData().getRange();
                    
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

                // executeYn 가져오기
                var scraperAct = await cAPI.getCurAct();
                if(scraperAct.executeYn == 'Y') {
                    // 저장 버튼 클릭
                    var saveBtn = await scraper.getElement('div[id^="popupPopDelyOkProcExcel-"] span:contains("저장")', 10000, 'Y');
                    saveBtn[0].click();

                    // 추후에 로직이 더 있을 거 같음
                }
            }

            // 성공 / 실패 여부 호출
            for(var order of orderList) {
                if(order.successYn == 'Y') {
                    await cAPI.setIsSuccessOrder(order.omsBuyNo, true, '[200] 성공');
                }
                else {
                    await cAPI.setIsSuccessOrder(order.omsBuyNo, false, `[400] 사유 :  ${order.fail}`); 
                }
            }

            await cAPI.resume();
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 파일 업로드 체크
    chkUpload: async function() {
        try {
            // SCM 그리드 데이터 가져오기
            var gridData = Ext.getCmp($('div[id^="popupPopDelyOkProcExcel-"] .x-grid')[0].id).store.getData().getRange();
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
    // 반품 수집
    getReturnList: async function() {
        try {
            // SK stoa SCM 클릭
            var skStoaBtn = await scraper.getElement('.ux-start-button', 10000, 'Y');
            skStoaBtn[0].click();

            // 배송관리탭 클릭
            var appBtn = await scraper.getElement('span:contains("배송관리")', 10000, 'Y');
            appBtn.click();

            // 출하지시/회수지시조회 메뉴로 이동
            var menu = await scraper.getElement('span:contains("출하지시/회수지시조회")', 10000, 'Y');
            menu.click();

            // 교환 체크박스 클릭
            var exchangeBtn = await scraper.getElement('[name="order_gb_chk30"]', 10000, 'Y');
            exchangeBtn.click();

            // 주문구분 회수로 변경
            var orderCls = await scraper.getElement('[name="slip_flag"]', 10000, 'Y');
            orderCls.click();

            // 조회 버튼 클릭
            var searchBtn = await scraper.getElement("[aria-label='조회 [F8]']", 10000, 'Y');
            searchBtn.click();

            // 주문이 있으면 엑셀 다운로드 버튼 클릭
            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregrid-"].x-panel.x-panel-default-framed.x-fit-item.x-grid')[0].id).store.getData().getRange().length > 0`, 100000);
            if(isCheck) {
                // 주문 다운로드
                var downloadBtn = await scraper.getElement("[aria-label='Save As EXCEL']", 10000, 'Y');
                downloadBtn.click();
            }
            else {
                await cAPI.success('[200] 반품 주문이 없습니다.');
            }
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 반품완료
    returnSuccess: async function() {
        try {
            // 출고/배송완료등록 메뉴로 이동
            var tab1 = await scraper.getElement(".ux-taskbar-clear-screen", 10000, 'Y');
            tab1[0].click();
            var menu = await scraper.getElement("span:contains('회수확정처리/이의제기')", 10000, 'Y');
            menu.click();

            // 조회 버튼 클릭
            var searchBtn = await scraper.getElement("[aria-label='조회 [F8]']", 10000, 'Y');
            searchBtn.click();

            // 스크래퍼 데이터 가져오기
            var scraperData = await cAPI.getData();

            // executeYn 가져오기
            var scraperAct = await cAPI.getCurAct();

            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregrid-"].x-panel.x-panel-default-framed.x-fit-item.x-grid')[0].id).store.getData().getRange().length > 0`, 10000);
            if(isCheck) {
                // SCM 그리드 데이터 가져오기
                var gridData = Ext.getCmp($('div[id^="cwaregrid-"].x-panel.x-panel-default-framed.x-fit-item.x-grid')[0].id).store.getData().getRange();
                                    
                // 일치하는 주문 찾아서 체크 및 운송장 번호 입력(입력 되는지 체크해야 됨)
                for(var order of scraperData.returnList) {
                    for(var i = 0; i < gridData.length; i++) {
                        if(order.claimVal2 == gridData[i].data.PROCESS_NO) {
                            gridData[i].data.CHECK_YN = '1';
                            gridData[i].data.DELY_GB = order.scmCurCompyCd;
                            gridData[i].data.SLIP_NO = order.returnBillNo;
                            order.successYn = 'Y';
                            await scraper.delay(500);
                            break;
                        }
                    }
                }

                // 저장 버튼 클릭
                var saveBtn = await scraper.getElement('[aria-label="저장 [F9]"]', 10000, 'Y');
                if(scraperAct.executeYn == 'Y') {
                    await cAPI.log("#### 중요 프로세스 시작 ####");
                    saveBtn.click();
                }
            }

            for(var order of scraperData.returnList) {
                if(order.successYn == 'Y') {
                    await cAPI.setIsSuccessOrder(order.scmReturnSeq, true, '[200] 성공');
                }
                else {
                    await cAPI.setIsSuccessOrder(order.scmReturnSeq, false, '[400] 해당 하는 주문을 찾지 못했습니다.');
                }
            }
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    }
}