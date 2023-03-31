/**
 * SK스토어
 */
scraper.skstore = {
    // 인증번호 발신 번호(아직 받지 않아서 모르겠음)
    authFromNo: '',
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

            await cAPI.setTimeoutResume(5000);

            // 로그인 버튼 클릭
            var loginBtn = await scraper.getElement(".x-btn-inner.x-btn-inner-default-small", 10000, 'Y');
            loginBtn[1].click();

            // 중복 로그인으로 인해 팝업이 뜨면 예 버튼 클릭
            // 핸드폰 인증 팝업이 뜨면 확인 버튼 클릭 후 인증 진행
            var okBtn = await scraper.getElement('span:contains("예")', 10000);
            var certPop = await scraper.getElement('span:contains("확인")', 10000);
            if(okBtn) {
                okBtn.click();
            }
            else if(certPop) {
                certPop.click();

                // 인증번호 받기 버튼 클릭
                var getCert = await scraper.getElement('span:contains("인증번호 받기")', 10000, 'Y');
                getCert.click();

                // 인증번호 입력
                var authNo = await scraper.getElement('[name="AUTH_NUMBER"]', 10000, 'Y');

                // 인증번호 요청 시간 설정
                scraper.skstore.authDttm = new Date();

                await scraper.delay(5000);

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
                            var regDttm = new DataTransfer(auth.regDttm);
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
                authNoOk.click();
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

                // 팝업에서 확인 클릭
                var okBtn = await scraper.getElement("span:contains('확인').x-btn-wrap.x-btn-wrap-default-small", 10000, 'Y');
                okBtn[0].click();
            }
            else {
                await cAPI.success('[200] 신규 주문이 없습니다.');
            }
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 주문 확인
    // 사은품이 포함된 주문은 주문 확인 처리 하면 안 되기 때문에 일괄로 처리할 수 없음
    // SCM GRID에서 체크하는 로직을 찾는게 베스트지만 찾을 수 없다면 2가지 방법 중 선택할 것
    // 1) 주문으로 LOOP 돌면서 SCM_BUY_NO로 검색해서 주문 확인   --- 주문이 많을 경우 시간이 오래 걸림
    orderConfirm1: async function() {
        try {
            // 실행 중인 스크래퍼 데이터 가져오기
            var curData = await cAPI.getCurData();

            // executeYn 가져오기
            var scraperAct = await cAPI.getCurAct();

            // 주문번호 입력
            var orderNo = await scraper.getElement('input[name="order_no"]', 10000, 'Y');
            orderNo.focus();
            await scraper.delay(1000);
            await cAPI.focus();
            await scraper.delay(1000);
            await cAPI.backInput(curData.item.scmBuyNo);

            // 조회 버튼 클릭
            var searchBtn = await scraper.getElement("[aria-label='조회 [F8]']", 10000, 'Y');
            searchBtn.click();

            // 주문 1건 있으면 전체선택 클릭 후 저장 버튼 클릭
            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregrid-"].x-panel.x-panel-default-framed.x-fit-item.x-grid')[0].id).store.getData().getRange().length == 1`, 10000);
            if(isCheck) {
                // 전체선택 클릭
                var allClick = await scraper.getElement("span:contains('전체선택')", 10000, 'Y');
                allClick[0].click();
                
                if(scraperAct.executeYn == 'Y') {
                    // 저장버튼 클릭
                    var saveBtn = await scraper.getElement('[data-qtip="저장 [F9]"]', 10000, 'Y');
                    saveBtn.click();
                }

                await cAPI.setIsSuccessOrder(curData.item.omsBuyNo, true, '[200] 성공');
            }
            else {
                await cAPI.setIsSuccessOrder(curData.item.omsBuyNo, false, '[400] 해당 주문을 찾지 못 했습니다.');
            }

            await cAPI.resume();
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 2) SCM_ITM_CD로 LIST를 만들어서 LOOP 돌면서 주문 확인     --- 인수인계서에 나온 방식이나 이중 체크를 해줘야 돼서 번거로움 ex) 동일한 SCM_ITM_CD를 가진 주문 5개 중 1개만 주문확인해야 되는 경우엔??
    // 상품 리스트 만들기
    setItmList: async function() {
        try {
            // 스크래퍼 데이터 가져오기
            var scraperData = await cAPI.getData();

            // 상품 리스트
            var itmList = {};

            for(var order of scraperData.orderList) {
                if(!itmList[order.scmItmCd]) {
                    itmList[order.scmItmCd] = [];
                }

                itmList[order.scmItmCd].push(order);
            }

            console.log(itmList);

            await cAPI.addData("itmList", itmList);

            await cAPI.resume();
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    },
    // 상품 코드가 동일한 주문끼리 주문확인처리
    orderConfirm2: async function() {
        try {
            // 실행 중인 스크래퍼 가져오기
            var curData = await cAPI.getCurData();

            // SCM_ITM_CD
            var scmItmCd = curData.item.Key;

            // 주문 리스트
            var keyValueList = curData.item.Value;
            var orderList = [];

            // 주문을 Key Value 형식으로 재정의
            for(var kvOrder of keyValueList) {
                var order = {};

                for(var a of kvOrder) {
                    order[a.Key] = a.Value;
                }

                orderList.push(order);
            }

            // 상품코드/명
            var goodsCode = await scraper.getElement('[name="goods_code"]', 10000, 'Y');
            goodsCode.focus();
            await scraper.delay(1000);
            await cAPI.focus();
            await scraper.delay(1000);
            goodsCode.val('');
            await scraper.delay(2000);  
            await cAPI.backInput(scmItmCd);

            // 조회 버튼 클릭
            var searchBtn = await scraper.getElement("[aria-label='조회 [F8]']", 10000, 'Y');
            searchBtn.click();

            // 주문 1건 있으면 전체선택 클릭 후 저장 버튼 클릭
            var isCheck = await scraper.isCheck(`Ext.getCmp($('div[id^="cwaregrid-"].x-panel.x-panel-default-framed.x-fit-item.x-grid')[0].id).store.getData().getRange().length == orderList.length`, 10000);
            if(isCheck) {
                // 일치하는 주문번호가 있는지 확인
                var scmOrderList = Ext.getCmp($('div[id^="cwaregrid-"].x-panel.x-panel-default-framed.x-fit-item.x-grid')[0].id).store.getData().getRange();
                for(var i = 0; i < orderList.length; i++) {
                    for(var order of scmOrderList) {
                        if(order.ORDER_NO == orderList[i].scmBuyNo) {
                            orderList[i].successYn = 'Y';
                            // SCM GRID에서 체크 찾아서 넣어야 함
                            break;
                        }
                    }
                }
                
                if(scraperAct.executeYn == 'Y') {
                    // 저장버튼 클릭
                    var saveBtn = await scraper.getElement('[data-qtip="저장 [F9]"]', 10000, 'Y');
                    saveBtn.click();
                }
            }

            for(var order of orderlist) {
                if(order.successYn == 'Y') {
                    await cAPI.setIsSuccessOrder(curData.item.omsBuyNo, true, '[200] 성공');
                }
                else {
                    await cAPI.setIsSuccessOrder(curData.item.omsBuyNo, false, '[400] 해당하는 주문을 찾을 수 없습니다.');
                }
            }

            await cAPI.resume();
        }
        catch(error) {
            await cAPI.error(error.message);
        }
    } 
}