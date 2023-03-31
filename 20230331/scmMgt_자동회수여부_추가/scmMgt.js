var scmMgt = function(page) {

    // 그리드 변수 선언
    var grid;
    // 리스트 변수 - 배열 선언 : 공통코드(cd)를 가지고 있지만 사용자에게는 이름(nm)을 보여줌
    var scmClsList = [], ifMthList = [], aditConfirmList = [], useYnList = [], 
        list = [{"code":"BOOKED", "value":"BOOKED"}, {"code":"ENTERED", "value":"ENTERED"}] , 
        checkYn = [{"code":"N", "value":"체크"}, {"code":"Y", "value":"미체크"}] , 
        buyCollMthList = [{"code":"MERGE", "value":"MERGE"},{"code":"DELETE", "value":"DELETE INSERT"}]; 

    page.ready = function(params) {

        // 리스트 변수 - 배열에 key값, value값 푸시
        $.when(select_scmClsList(), select_ifMthList(), select_aditConfirmList(), select_useYnList()).done(function(data1, data2, data3, data4) {

            data1[0].forEach(function(item) {
                scmClsList.push({
                    scmCls: item.cd, cdNm: item.cdNm
                });
            });

            data2[0].forEach(function(item) {
                
                ifMthList.push({
                    ifMth: item.cd, cdNm: item.cdNm
                });
            });

            data3[0].forEach(function(item) {
                aditConfirmList.push({
                    aditConfirm: item.cd, cdNm: item.cdNm
                });
            });

            data4[0].forEach(function(item) {
                useYnList.push({
                    useYn: item.cd, cdNm: item.cdNm
                });
            });

            init();

        });

    };

    function init() {

        scmListGrid();

        // SCM 구분 셀렉트 박스
        page.select('[name="scmCls"]', {
            width: '182',
            search: false,
            placeholder: '전체',
            allowClear: true,
            grpCd: 'CD0002',
            upCd: 'CD0002'
        });

        // 코딩관리 셀렉트 박스
        page.select('[name="itmCoding"]', {
            width: '182',
            search: false,
            placeholder: '전체',
            allowClear: true,
            grpCd: 'CD0010',
            upCd: 'CD0010'
        });

        // 배송템플릿관리 셀렉트 박스
        page.select('[name="delvryTmplat"]', {
            width: '182',
            search: false,
            placeholder: '전체',
            allowClear: true,
            grpCd: 'CD0010',
            upCd: 'CD0010'
        });

        // 카테고리관리 셀렉트 박스
        page.select('[name="ctgry"]', {
            width: '182',
            search: false,
            placeholder: '전체',
            allowClear: true,
            grpCd: 'CD0010',
            upCd: 'CD0010'
        });

        // API 제공 셀렉트 박스
        page.select('[name="apiOfr"]', {
            width: '182',
            search: false,
            placeholder: '전체',
            allowClear: true,
            grpCd: 'CD0010',
            upCd: 'CD0010'
        });

        // 연동방법 셀렉트 박스
        page.select('[name="ifMth"]', {
            width: '182',
            search: false,
            placeholder: '전체',
            allowClear: true,
            grpCd: 'CD0003',
            upCd: 'CD0003'
        });

        // 사용여부 셀렉트 박스
        page.select('[name="useYn"]', {
            width: '182',
            search: false,
            placeholder: '전체',
            allowClear: true,
            grpCd: 'CD0010',
            upCd: 'CD0010'
        });

        // 그리드 컬럼
        var columns = [
            { dataField : 'scmCd', headerText: 'SCM 코드', editable: false, width: 70 },
            { dataField : 'scmNm', headerText: 'SCM 명', editable: true, width: 135 },
            {dataField : 'scmCls', headerText: 'SCM 구분', editable: false, width: 85,
                renderer : {
                    type : "DropDownListRenderer",
                    list: scmClsList, //key-value Object 로 구성된 리스트
                    keyField : "scmCls", // key 에 해당되는 필드명
                    valueField : "cdNm" // value 에 해당되는 필드명
                }
            },
            {dataField : 'ifMth', headerText: '연동방법', editable: false, width: 90,
                renderer : {
                    type : "DropDownListRenderer",
                    list: ifMthList, //key-value Object 로 구성된 리스트
                    keyField : "ifMth", // key 에 해당되는 필드명
                    valueField : "cdNm" // value 에 해당되는 필드명
                }
            },
            {dataField : 'aditConfirm', headerText: '2차인증', editable: false, width: 75,
                renderer : {
                    type : "DropDownListRenderer",
                    list: aditConfirmList, //key-value Object 로 구성된 리스트
                    keyField : "aditConfirm", // key 에 해당되는 필드명
                    valueField : "cdNm" // value 에 해당되는 필드명
                }
            },
            {dataField : 'ovlapLoginYn', headerText: '중복로그인', editable: false, width: 80,
                renderer : {
                    type : "DropDownListRenderer",
                    list : useYnList, //key-value Object 로 구성된 리스트
                    keyField : "useYn", // key 에 해당되는 필드명
                    valueField : "cdNm" // value 에 해당되는 필드명
                }
            },
            {dataField : 'buyCollMth', headerText: '주문수집방법', editable: false, width: 120,
                renderer : {
                    type : "DropDownListRenderer",
                    list : buyCollMthList, //key-value Object 로 구성된 리스트
                    keyField : "code", // key 에 해당되는 필드명
                    valueField : "value" // value 에 해당되는 필드명
                }
            },
            {dataField : 'itmCoding', headerText: '상품코딩', editable: false, visible: false,
                renderer : {
                    type : "DropDownListRenderer",
                    list : useYnList, //key-value Object 로 구성된 리스트
                    keyField : "useYn", // key 에 해당되는 필드명
                    valueField : "cdNm" // value 에 해당되는 필드명
                }
            },
            {dataField : 'delvryTmplat', headerText: '배송템플릿관리', editable: false, visible: false,
                renderer : {
                    type : "DropDownListRenderer",
                    list : useYnList, //key-value Object 로 구성된 리스트
                    keyField : "useYn", // key 에 해당되는 필드명
                    valueField : "cdNm" // value 에 해당되는 필드명
                }
            },
            {dataField : 'apiOfr', headerText: 'API 제공', editable: false, visible: false,
                renderer : {
                    type : "DropDownListRenderer",
                    list : useYnList, //key-value Object 로 구성된 리스트
                    keyField : "useYn", // key 에 해당되는 필드명
                    valueField : "cdNm" // value 에 해당되는 필드명
                }
            },
            {dataField : 'ctgry', headerText: '카테고리관리', editable: false, visible: false,
                renderer : {
                    type : "DropDownListRenderer",
                    list : useYnList, //key-value Object 로 구성된 리스트
                    keyField : "useYn", // key 에 해당되는 필드명
                    valueField : "cdNm" // value 에 해당되는 필드명
                }
            },
            {dataField : 'remarkConfYn', headerText: '비고확인여부', editable: false, width: 80,
                renderer : {
                    type : "DropDownListRenderer",
                    list : useYnList, //key-value Object 로 구성된 리스트
                    keyField : "useYn", // key 에 해당되는 필드명
                    valueField : "cdNm" // value 에 해당되는 필드명
                }
            },
            {dataField : 'fitOrderYn', headerText: '설치지시여부', editable: false,
                renderer : {
                    type : "DropDownListRenderer",
                    list : useYnList, //key-value Object 로 구성된 리스트
                    keyField : "useYn", // key 에 해당되는 필드명
                    valueField : "useYn" // value 에 해당되는 필드명
                }
            },
            {dataField : 'ncodeConfYn', headerText: 'N코드확인', editable: false,
                renderer : {
                    type : "DropDownListRenderer",
                    list : checkYn, //key-value Object 로 구성된 리스트
                    keyField : "code", // key 에 해당되는 필드명
                    valueField : "value" // value 에 해당되는 필드명
                }
            },
            {dataField : 'autoWaybillSandYn', headerText: '자동운송장발송', editable: false, width: 95,
                renderer : {
                    type : "DropDownListRenderer",
                    list : useYnList, //key-value Object 로 구성된 리스트
                    keyField : "useYn", // key 에 해당되는 필드명
                    valueField : "useYn" // value 에 해당되는 필드명
                }
            },
            // 2023년 03월 31일 자동회수여부 추가
            {dataField: 'autoReturnYn', headerText: '자동회수여부', editable: false, width: 85,
                renderer : {
                    type : "DropDownListRenderer",
                    list : useYnList, //key-value Object 로 구성된 리스트
                    keyField : "useYn", // key 에 해당되는 필드명
                    valueField : "useYn" // value 에 해당되는 필드명
                }
            },
            {dataField : 'packingMgmtYn', headerText: '패킹사용', editable: false, width: 65,
                renderer : {
                    type : "DropDownListRenderer",
                    list : useYnList, //key-value Object 로 구성된 리스트
                    keyField : "useYn", // key 에 해당되는 필드명
                    valueField : "useYn" // value 에 해당되는 필드명
                }
            },
            {dataField : 'delvryDomesticBuy', headerText: '택배품내수주문', editable: false, width: 95,
                renderer : {
                    type : "DropDownListRenderer",
                    list : list, //key-value Object 로 구성된 리스트
                    keyField : "code", // key 에 해당되는 필드명
                    valueField : "value" // value 에 해당되는 필드명
                }
            },
            {dataField : 'delvryMvmnBuy', headerText: '택배품이동주문', editable: false, width: 95,
                renderer : {
                    type : "DropDownListRenderer",
                    list : list, //key-value Object 로 구성된 리스트
                    keyField : "code", // key 에 해당되는 필드명
                    valueField : "value" // value 에 해당되는 필드명
                }
            },
            {dataField : 'fitBuy', headerText: '설치주문', editable: false, width: 90,
                renderer : {
                    type : "DropDownListRenderer",
                    list : list, //key-value Object 로 구성된 리스트
                    keyField : "code", // key 에 해당되는 필드명
                    valueField : "value" // value 에 해당되는 필드명
                }
            },
            {dataField : 'logisDomesticBuy', headerText: '물류내수주문', editable: false, width: 90,
                renderer : {
                    type : "DropDownListRenderer",
                    list : list, //key-value Object 로 구성된 리스트
                    keyField : "code", // key 에 해당되는 필드명
                    valueField : "value" // value 에 해당되는 필드명
                }
            },
            {dataField : 'logisMvmnBuy', headerText: '물류이동주문', editable: false, width: 90,
                renderer : {
                    type : "DropDownListRenderer",
                    list : list, //key-value Object 로 구성된 리스트
                    keyField : "code", // key 에 해당되는 필드명
                    valueField : "value" // value 에 해당되는 필드명
                }
            },
            {dataField : 'fitDomesticBuy', headerText: '설치내수', editable: false, visible : false,
                renderer : {
                    type : "DropDownListRenderer",
                    list : list, //key-value Object 로 구성된 리스트
                    keyField : "code", // key 에 해당되는 필드명
                    valueField : "value" // value 에 해당되는 필드명
                }
            },
            {dataField : 'useYn', headerText: '사용여부', editable: false, width: 65,
                renderer : {
                    type : "DropDownListRenderer",
                    list : useYnList, //key-value Object 로 구성된 리스트
                    keyField : "useYn", // key 에 해당되는 필드명
                    valueField : "cdNm" // value 에 해당되는 필드명
                }
            }
        ];

        // 그리드 생성 및 속성 설정
        grid = AUIGrid.create(page.AUIGrid.id('#scmListGrid'), columns, {
            showStateColumn : true, // 상태 칼럼 사용
            showRowNumColumn: false,
            softRemoveRowMode: false,   // 행을 삭제시 (true: 상태만변경, false: 행삭제)
            selectionMode : "multipleCells"
        });

        // 버튼 이벤트 등록
        page.$(".rs-btn").on("click", _.debounce(function(e) {
            switch(e.target.name) {
                case "btn_scmMgtSearch":
                    console.log("조회버튼 클릭");
                    scmListGrid();
                    break;
                case "btn_scmMgtSave":
                    console.log("저장버튼 클릭");
                    save_scmListGrid();
                    break;
                case "btn_scmMgtAdd":
                    console.log("추가버튼 클릭");
                    addRow();
                    break;
                case "btn_scmMgtDel":    
                    console.log("삭제버튼 클릭");
                    del_scmListGrid();
                    break;
            }
        }));

    }

    // SCM 목록 그리드 : SCM 구분 셀렉트 박스
    function select_scmClsList() {
        return rUtil.send({
            url: '/rest/system/get-scmClsList',
            method: 'post',
            success: function(data) {
                console.log('select_scmClsList 조회 성공', data);
            }
        });
    }

    // SCM 목록 그리드 : 연동 방법 셀렉트 박스
    function select_ifMthList() {
        return rUtil.send({
            url: '/rest/system/get-ifMthList',
            method: 'post',
            success: function(data) {
                console.log('select_ifMthList 조회 성공', data);
            }
        });
    }

    // SCM 목록 그리드 : 추가 인증 셀렉트 박스
    function select_aditConfirmList() {
        return rUtil.send({
            url: '/rest/system/get-aditConfirmList',
            method: 'post',
            success: function(data) {
                console.log('select_aditConfirmList 조회 성공', data);
            }
        });
    }

    // SCM 목록 그리드 : 셀렉트 박스 : 사용 여부
    function select_useYnList() {
        return rUtil.send({
            url: '/rest/system/get-useYnList',
            method: 'post',
            success: function(data) {
                console.log('select_useYnList 조회 성공', data);
            }
        });
    }

    // 행 추가 기능 아이템/디폴트 값 설정 및 그리드 삽입 설정
    function addRow(item) {
        var item = {
            scmCls : '01',
            ifMth : '01',
            aditConfirm : '01',
            ovlapLoginYn : 'Y',
            buyCollMth : 'MERGE',
            itmCoding : 'Y',
            delvryTmplat : 'Y',
            apiOfr : 'Y',
            autoWaybillSandYn: 'Y',
            autoReturnYn: 'Y',                      // 2023년 03월 31일 자동회수여부 추가
            ctgry : 'Y',
            delvryDomesticBuy : 'ENTERED',
            delvryMvmnBuy : 'ENTERED',
            fitBuy : 'ENTERED',
            logisDomesticBuy : 'ENTERED',
            logisMvmnBuy : 'ENTERED',
            fitDomesticBuy : 'ENTERED',
            fitOrderYn : 'Y',
            remarkConfYn : 'N',
            ncodeConfYn : 'Y',
            packingMgmtYn : 'N',
            useYn : 'Y'
        }
        AUIGrid.addRow(grid, item, 'first');
    };

    // SCM 목록 그리드 데이터 가져오는 함수
    function scmListGrid(){
        var params = page.serializeObject(page.$('[data-area="search_area_scmListGrid"]'));
        rUtil.showLoader();
        rUtil.send({
            method: 'POST',
            url: '/rest/system/post-scmListGrid',
            data: params,
            success: function(data) {
                rUtil.hideLoader();
                AUIGrid.setGridData(grid, data);
            }
        });
    };

     //scm 그리드 수정, 추가된 아이템 얻기
     function getDataList() {
        var addedRowItems = AUIGrid.getAddedRowItems(grid);       // 추가된 행
        var editedRowItems = AUIGrid.getEditedRowItems(grid);     // 수정된 행
        var removedRowItems = AUIGrid.getRemovedItems(grid);      // 삭제된 행

        var scmData = {};
        scmData.addList = addedRowItems;
        scmData.updateList = editedRowItems;
        scmData.removeList = removedRowItems;

        return scmData;
    }

    // 저장 save
    function save_scmListGrid(params){

        var params = {};
        //그리드 수정/추가 데이터 얻어오기
        params =  getDataList();
        
        var cnt = 0;

        // 추가, 수정된 행(배열)의 갯수
        cnt = params.addList.length + params.updateList.length;
     
        //수정되거나 추가 된 항목 체크
        if(cnt == 0){
            rUtil.alert('추가되거나 변경된 건이 없습니다.');
            return;
        }

        // 추가된 행(배열)의 갯수가 0보다 크면 아래 구문 실행
        if(params.addList.length > 0){
            // 배열 타입 선언
            params.addList.scmNm = [];
            // i=0(F12 : 행(배열)이 0부터 시작), i가 추가된 행(배열)의 갯수보다 작거나 같아야 함 -> i가 더 커지면 if문을 빠져나가 더이상 수행하지 않음 : 배열의 길이를 모를 때 length를 이용, i++ : i값이 1씩 증가
            for(var i=0; i <= params.addList.scmNm.length; i++) {
                // i값이 1씩 증가해서 최대 배열 길이까지 for문 돌아감
                // 추가한 행에서 scmNm이 ''(빈 값)이라면 알럿창 띄움 -> 필수값 설정
                if(params.addList[i].scmNm == ''){
                    rUtil.alert('SCM 명을 입력해주세요.');
                    return;
                }
            }
        // 수정된 행(배열)의 갯수가 0보다 크면 아래 구문 실행
        }else if(params.updateList.length > 0){
            // 배열 타입 선언
            params.updateList.scmNm = [];
            for(var i=0; i <= params.updateList.scmNm.length; i++) {
                // 수정한 행에서 scmNm이 ''(빈 값)이라면 알럿창 띄움 -> 필수값 설정
                if(params.updateList[i].scmNm == ''){
                    rUtil.alert('SCM 명을 입력해주세요.');
                    return;
                }
            }
        }

        // 확인/취소 버튼 있는 모달
        rUtil.confirm('저장하시겠습니까?', function(data) {
            //확인 시 data 가 true 반환, 취소 시 false 반환
            if(data == true){
                // 저장 아작스
                rUtil.send({
                    method: 'POST',
                    url: '/rest/system/post-save_scmListGrid',
                    data: params,
                    success: function(data) {
                        if(data !== 0) {
                            rUtil.alert("저장되었습니다.");
                            console.log(params);
                            console.log(data);
                            // 목록 재조회
                            scmListGrid();
                            return;
                        }
                        else {
                            rUtil.alert("저장 중 에러가 발생했습니다. 다시 시도해주세요.");
                            return;
                        }
                    }
                });
            }
        });

    }

    // SCM 목록 : 삭제 delete
    function del_scmListGrid(params) {

        var params = {};
        // 그리드에서 선택한 행 == 그리드 삭제 데이터 가져오기
        var item = AUIGrid.getSelectedRows(grid);
        var cnt = '0';

        //삭제할 scm 선택 안함 메세지
        if(item.length == 0) {
            rUtil.alert("삭제할 SCM을 선택하세요.");
            return
        }

        params.scmCd = item[0].scmCd;
        // 다른 테이블에서 사용 중인 데이터 삭제 불가
        // 삭제 가능여부 체크 아작스
        rUtil.send({
            method: 'POST',
            url: '/rest/system/post-del_scmListGridCheck',
            data: params,
            async: false,
            success: function(data) {
                cnt = data;
            }
        });

        // 삭제 가능여부 체크
        if(cnt != '0') { // 1 == 삭제 불가능, 0 == 삭제 가능
            rUtil.alert("선택된 SCM이 시스템에서 사용되고 있어 삭제 할 수 없습니다.");
            return
        }

        // 확인/취소 버튼 있는 모달
        rUtil.confirm('삭제하시겠습니까?', function(data) {
            // 확인 시 data 가 true 반환, 취소 시 false 반환
            if(data == true) {
                // 삭제 아작스
                rUtil.send({
                    method: 'POST',
                    url: '/rest/system/post-del_scmListGrid',
                    data: params,
                    success: function(data) {
                        rUtil.alert("삭제되었습니다.");
                        scmListGrid();
                    }
                });
            }
            
        });
    }
};
