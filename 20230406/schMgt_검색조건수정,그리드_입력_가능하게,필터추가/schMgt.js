var schMgt = function(page) {

    var grid;

    var schActGroupSeq_list = [], schType_list = [], useYn_list = [], schAttr2_scm_list = [], schAttr2_delivery_list = [], schActGroupAttr_list = [];

    var searchList;

    page.ready = function(params) {

        $.when(select_schActGroupSeq_list(), select_schType_list(),  select_useYn_list() , select_schAttr2_scm_list(), select_schAttr2_delivery_list(), select_grid_schActGroupAttr()).done(function(data1, data2, data3, data4, data5, data6) {

            data1[0].forEach(function(item) {
                schActGroupSeq_list.push({
                    schActGroupSeq: item.schActGroupSeq, schActGroupNm: item.schActGroupNm
                });
            });

            data2[0].forEach(function(item) {
                schType_list.push({
                    schType: item.cd, cdNm: item.cdNm
                });
            });

            data3[0].forEach(function(item) {
                useYn_list.push({
                    useYn: item.cd, cdNm: item.cdNm
                });
            });

            data4[0].forEach(function(item) {
                schAttr2_scm_list.push({
                    code: item.code, value: item.value
                });
            });

            data5[0].forEach(function(item) {
                schAttr2_delivery_list.push({
                    code: item.code, value: item.value
                });
            });

            data6[0].forEach(function(item) {
                schActGroupAttr_list.push({
                    schActGroupSeq: item.schActGroupSeq,
                    schActGroupAttr1: item.schActGroupAttr1,
                    schActGroupAttr2: item.schActGroupAttr2
                });
            });

            init();

        });

        // 업무명 조회
        page.multiSelect('[name="bizList"]', {
            send: { url: '/rest/system/get-biz', method: 'GET' },
            id: "bizCd",
            text: "bizNm",
            textFormat: "[${id}] ${text}"
        });

        // 스케줄 목록 그리드 셀렉트 박스 : 스케줄 액션 그룹 명
        function select_schActGroupSeq_list() {
            return rUtil.send({
                url: '/rest/system/get-schActGroupSeq_list',
                method: 'GET',
                success: function(data) {
                    console.log('액션 그룹 명 조회 성공 : ', data);
                }
            });
        }

        // 스케줄 목록 그리드 셀렉트 박스 : 스케줄 타입
        function select_schType_list() {
            return rUtil.send({
                url: '/rest/system/get-schType_list',
                method: 'GET',
                success: function(data) {
                    console.log('스케줄 타입 조회 성공 : ', data);
                }
            });
        }

        // 스케줄 목록 그리드 셀렉트 박스 : 스케줄 계정 선택 : SCM 계정 목록
        function select_schAttr2_scm_list() {
            return rUtil.send({
                url: '/rest/system/get-select_scm',
                method: 'GET',
                success: function(data) {
                    console.log('SCM 계정 목록 조회 성공 : ', data);
                }
            });
        }

        // 스케줄 목록 그리드 셀렉트 박스 : 스케줄 계정 선택 : 택배 계정 목록
        function select_schAttr2_delivery_list() {
            return rUtil.send({
                url: '/rest/system/get-schMgt_curCompyList',
                method: 'GET',
                success: function(data) {
                    console.log('택배 계정 목록 조회 성공 : ', data);
                }
            });
        }

        // 스케줄 목록 그리드 셀렉트 박스 : 사용 여부
        function select_useYn_list() {
            return rUtil.send({
                url: '/rest/system/get-useYn_list',
                method: 'GET',
                success: function(data) {
                    console.log('사용 여부 조회 성공 : ', data);
                }
            });
        }

        // 스케줄 액션 그룹 명 컬럼값 변경 시 스케줄 구분, 스케줄 계정 선택 -> 자동 변경
        function select_grid_schActGroupAttr() {
            return rUtil.send({
                url: '/rest/system/get-select_grid_schActGroupAttr',
                method: 'GET',
                success: function(data) {
                    console.log('액션 그룹 명 변경에 따른 구분, 계정 조회 성공 : ', data);
                }
            });
        }

        function init() {

            schMgtListGrid();

            // 검색 조건 셀렉트 박스 : 스케줄 구분
            page.select('[name="schActGroupAttr1"]', {
                search: false,
                placeholder: '전체',
                allowClear: true,
                textFormat: '${text}',
                send: {
                    method: 'GET',
                    url: '/rest/system/get-select_schActGroupAttr1',
                    id: 'schActGroupAttr1',
                    text: 'schActGroupAttr1'
                }
            });

            // 스케줄 구분 셀렉트박스 선택 후 계정 선택 셀렉트박스에 값 바인딩
            page.$("[name='schActGroupAttr1']").on("change", function() {
                // 스케줄 구분 값 가져오기
                var param = { schActGroupAttr1: page.$("[name='schActGroupAttr1'] option:selected").val() }
                
                // 스케줄 구분을 선택하지 않았으면 계정 선택 숨기기
                if(param.schActGroupAttr1 == undefined) {
                    param.schActGroupAttr1 = '';
                    page.$('div[id*="scmList"].multiselect-wrapper').hide();
                    page.$('div[id*="deliveryList"].multiselect-wrapper').hide();
                    searchList = '0';
                }
                // 스케줄 구분이 SCM이면 SCM 계정 리스트 보여주기
                if(param.schActGroupAttr1 == 'SCM') {
                    page.multiSelect('[name="scmList"]', {
                        send: {
                            method: "GET",
                            url: "/rest/system/get-select_scm",
                            data: param,
                        },
                        id: "code",
                        text: "value"
                    });

                    page.$("[name='seachList']").removeClass('d-n');
                    page.$('div[id*="deliveryList"].multiselect-wrapper').hide();
                    page.$('div[id*="scmList"].multiselect-wrapper').show();
                    searchList = '1';
                }
                // 스케줄 구분이 DELIVEY면 배송 계정 리스트 보여주기
                else if(param.schActGroupAttr1 == 'DELIVERY') {
                    page.multiSelect('[name="deliveryList"]', {
                        send: {
                            method: "GET",
                            url: "/rest/system/get-schMgt_curCompyList",
                            data: param,
                        },
                        id: "code",
                        text: "value"
                    });

                    page.$("[name='seachList']").removeClass('d-n');
                    page.$('div[id*="scmList"].multiselect-wrapper').hide();
                    page.$('div[id*="deliveryList"].multiselect-wrapper').show();
                    searchList = '2';
                }
            });

            // 검색 조건 셀렉트 박스 : 스케줄 타입
            page.select('[name="schType"]', {
                search: false,
                placeholder: '전체',
                allowClear: true,
                grpCd: 'CD0041',
                upCd: 'CD0041'
            });

            // 검색 조건 셀렉트 박스 : 사용 여부               --2023년 4월 6일 추가
            page.select('[name="useYn"]', {
                search: false,
                placeholder: '전체',
                allowClear: true,
                grpCd: 'CD0010',
                upCd: 'CD0010'
            });

            var columns = [
                            { dataField : 'schSeq', headerText : 'SEQ', editable: false, width: 40 },
                            { dataField : 'schNm', headerText : '스케줄 명', editable: true, width: 280, style : 'ta-l', filter : { showIcon : true } },     // 2023년 4월 6일 추가
                            { dataField : 'schType', headerText : '스케줄 타입', editable: false, width: 90,
                                renderer : {
                                    type : "DropDownListRenderer",
                                    list: schType_list,
                                    keyField : "schType",
                                    valueField : "cdNm"
                                }
                            },
                            { dataField : 'schValue', headerText : '스케줄 값', editable: true, width: 80 },
                            { dataField : 'schStartTime', headerText : '시작 일시', editable: true, width: 80, editRenderer : { maxlength : 14 } },
                            { dataField : 'schEndTime', headerText : '종료 일시', editable: true, width: 80, editRenderer : { maxlength : 14 } },
                            { dataField : 'schActiveStartDt', headerText : '시작 일자', editable: true, width: 100, dateInputFormat : "yyyy-mm-dd", formatString : "yyyy-mm-dd", dataType : "date",
                                editRenderer: {
                                    type: "CalendarRenderer",
                                    defaultFormat: "yyyy-mm-dd", // 달력 선택 시 데이터에 적용되는 날짜 형식
                                    showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 출력 여부
                                    onlyCalendar: false, // 사용자 입력 불가, 즉 달력으로만 날짜입력 (기본값 : true)
                                    showExtraDays: true, // 지난 달, 다음 달 여분의 날짜(days) 출력
                                    showTodayBtn: true, // 오늘 날짜 선택 버턴 출력
                                    showUncheckDateBtn: false, // 날짜 선택 해제 버턴 출력
                                    todayText: "오늘 선택", // 오늘 날짜 버턴 텍스트
                                }
                            },
                            { dataField : 'schActiveEndDt', headerText : '종료 일자', editable: true, width: 100, dateInputFormat : "yyyy-mm-dd", formatString : "yyyy-mm-dd", dataType : "date",
                                editRenderer: {
                                    type: "CalendarRenderer",
                                    defaultFormat: "yyyy-mm-dd", // 달력 선택 시 데이터에 적용되는 날짜 형식
                                    showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 출력 여부
                                    onlyCalendar: false, // 사용자 입력 불가, 즉 달력으로만 날짜입력 (기본값 : true)
                                    showExtraDays: true, // 지난 달, 다음 달 여분의 날짜(days) 출력
                                    showTodayBtn: true, // 오늘 날짜 선택 버턴 출력
                                    showUncheckDateBtn: false, // 날짜 선택 해제 버턴 출력
                                    todayText: "오늘 선택", // 오늘 날짜 버턴 텍스트
                                }
                            },
                            { dataField : 'schActGroupSeq', headerText : '그룹 SEQ', editable: false, width: 75 },
                            page.AUIGrid.ComboBoxRenderer({
                                dataField : 'schActGroupSeq',
                                headerText : '액션 그룹 명',
                                list : schActGroupSeq_list,
                                keyField : "schActGroupSeq",
                                valueField : "schActGroupNm",
                                width : 280,
                                style : 'ta-l',
                                editRenderer : {
                                    autoCompleteMode : true, // 자동완성 모드 설정
                                    autoEasyMode : true // 자동완성 모드일 때 자동 선택할지 여부 (기본값 : false)
                                }
                            }),
                            { dataField : 'schActGroupAttr1', headerText : '구분', editable: false },
                            { dataField : 'schActGroupAttr2', headerText : '계정 선택', editable: false, width: 160,
                                labelFunction : function(  rowIndex, columnIndex, value, headerText, item ) {
                                    var retStr = value;
                                    for(var i=0,len=schAttr2_scm_list.length; i<len; i++) {
                                        if(schAttr2_scm_list[i]["code"] == value) {
                                            retStr = schAttr2_scm_list[i]["value"];
                                            break;
                                        }
                                    }
                                    for(var i=0,len=schAttr2_delivery_list.length; i<len; i++) {
                                        if(schAttr2_delivery_list[i]["code"] == value) {
                                            retStr = schAttr2_delivery_list[i]["value"];
                                            break;
                                        }
                                    }
                                    return retStr;
                                }
                            },
                            { dataField : 'useYn', headerText : '사용 여부', editable: false,
                                renderer : {
                                    type : "DropDownListRenderer",
                                    list: useYn_list,
                                    keyField : "useYn",
                                    valueField : "cdNm"
                                }
                            },
                            { dataField : 'SCH_ATTR1', headerText : '속성 1', width: 80 },
                            { dataField : 'SCH_ATTR2', headerText : '속성 2', width: 80 },
                            { dataField : 'SCH_ATTR3', headerText : '속성 3', width: 80 },
                            { dataField : 'SCH_ATTR4', headerText : '속성 4', width: 80 },
                            { dataField : 'SCH_ATTR5', headerText : '속성 5', width: 80 }
            ];

            grid = AUIGrid.create(page.AUIGrid.id('#schMgtListGrid'), columns, {
                showStateColumn : true,
                showRowNumColumn: false,
                softRemoveRowMode: true,
                enableFilter : true ,
                selectionMode : 'multipleCells'
            });

            // cellEditEnd : 편집, 수정 모드에서 셀 편집(수정) 종료 시 발생하는 이벤트
            AUIGrid.bind(grid, "cellEditEnd", function( event ) { // cellEditEnd = rowIndex 가져옴
                if(event.columnIndex == 9) { // 스케줄 액션 그룹 명이면, 9번째 컬럼
                    if(event.oldvalue != Number(event.value)) { // oldvalue, newvalue 비교 -> 동일한 값일 경우 업데이트 할 필요 X            
                        schActGroupAttr_list.forEach(function(item) { // forEach문 -> for문과 동일하지만 사용 방식이 다름, 배열 길이를 지정 하지 않아도 배열 수 만큼 돌아감
                            if(item.schActGroupSeq == Number(event.value)) { // item에 있는 schActGroupSeq와 newvalue(사용자 선택 값)이 동일하면 == 사용자가 스케줄 액션 그룹 명 컬럼값을 변경하면(동일값이 아닐 때)
                                AUIGrid.updateRow(grid, {schActGroupAttr1/* 컬럼명 */ : item.schActGroupAttr1/* 명칭 */}, event.rowIndex/* rowIndex 가져와서 업데이트 */);
                                AUIGrid.updateRow(grid, {schActGroupAttr2/* 컬럼명 */ : item.schActGroupAttr2/* 명칭 */}, event.rowIndex/* rowIndex 가져와서 업데이트 */);
                            }
                        })
                    }
                }
            });

            // 버튼 이벤트 등록
            page.$(".rs-col-6").on("click", _.debounce(function(e) {
                switch(e.target.name) {
                    case "btn_schMgtSearch":
                        console.log("#### 조회 버튼 클릭 ####");
                        schMgtListGrid();
                        break;
                    case "btn_schMgtSave":
                        console.log("#### 저장 버튼 클릭 ####");
                        save_schMgt();
                        break;
                    case "btn_schMgtAdd":
                        console.log("#### 추가 버튼 클릭 ####");
                        addRow();
                        break;
                    case "btn_schMgtDel":
                        console.log("#### 삭제 버튼 클릭 ####");
                        delete_schMgt();
                        break;
                }
            }));

            // 행 추가 기능 아이템/디폴트 값 설정 및 그리드 삽입 설정
            function addRow() {
                var item = { schType : '01', useYn : 'Y' }
                AUIGrid.addRow(grid, item, 'first');
            };
        }

        // 스케줄 목록 그리드 데이터 가져오는 함수
        function schMgtListGrid(){
            // 검색 파라미터 가져외기
            var params = page.serializeObject(page.$('[data-area="search_area_schMgtListGrid"]'));
            // 스케줄 구분이 SCM이면 택배사 계정 선택 초기화
            if(searchList == '1') {
                params.deliveryList = null;
            }
            // 스케줄 구분이 DEIVERY면 SCM 계정 선택 초기화
            else if(searchList == '2') {
                params.scmList = null;
            }
            // 스케줄 구분이 없으면 전체 계정 선택 초기화
            else if(searchList == '0') {
                params.deliveryList = null;
                params.scmList = null;
            }

            rUtil.showLoader();
            rUtil.send({
                method: 'POST',
                url: '/rest/system/get-select_schMgt',
                data: params,
                success: function(data) {
                    rUtil.hideLoader();
                    AUIGrid.setGridData(grid, data);
                }
            });
        };

        // 삭제 실행 : 확인, 취소
        function delete_schMgt(item) {
            // 그리드에서 선택한 행 == 그리드 삭제 데이터 가져오기
            var params = {};
            var item = AUIGrid.getSelectedRows(grid);
            params = item[0];
            
            // 삭제할 스케줄 선택 안함 메세지
            if(item.length == 0) {
                rUtil.alert("삭제할 스케줄을 선택하세요.");
                return;
            }

            AUIGrid.removeRow(grid, "selectedIndex");
        };

        // 저장 버튼 클릭
        function save_schMgt() {
            var params = page.serializeObject(page.$('[data-area="search_area_schMgtListGrid"]'));

            var addedRowItems   = AUIGrid.getAddedRowItems(grid);   // 추가된 행 아이템들(배열)
            var editedRowItems  = AUIGrid.getEditedRowItems(grid);  // 수정된 행 아이템들(배열)
            var removedRowItems = AUIGrid.getRemovedItems(grid);    // 삭제된 행 아이템들(배열)

            var cnt = addedRowItems.length+editedRowItems.length+removedRowItems.length;
            if(cnt == 0) {
                rUtil.alert('수정된 내용이 없습니다.');
                return;
            }

            if(addedRowItems.length > 0) {
                for(var i=0; i<addedRowItems.length; i++) {
                    addedRowItems[i].schActiveStartDt = addedRowItems[i].schActiveStartDt.replace(/-/gi,"");
                    addedRowItems[i].schActiveEndDt = addedRowItems[i].schActiveEndDt.replace(/-/gi,"");

                    if(Number(addedRowItems[i].schActiveStartDt) > Number(addedRowItems[i].schActiveEndDt)) {
                        rUtil.alert('추가 건의 스케줄 종료 일자가 스케줄 시작 일자보다 빠를 수 없습니다.');
                        return;
                    }
                }
            }
            if(editedRowItems.length > 0) {
                for(var i=0; i<editedRowItems.length; i++) {
                    editedRowItems[i].schActiveStartDt = editedRowItems[i].schActiveStartDt.replace(/-/gi,"");
                    editedRowItems[i].schActiveEndDt = editedRowItems[i].schActiveEndDt.replace(/-/gi,"");

                    if(Number(editedRowItems[i].schActiveStartDt) > Number(editedRowItems[i].schActiveEndDt)) {
                        rUtil.alert('수정 건의 스케줄 종료 일자가 스케줄 시작 일자보다 빠를 수 없습니다.');
                        return;
                    }
                }
            }

            // 전체 그리드 데이터 가지고오기
            var gridData = AUIGrid.getGridData(grid);

            // 필수값 체크
            for(var i = 0; i < gridData.length; i++){
                if(gridData[i].schNm == '') {
                    rUtil.alert('스케줄 명을 입력해주세요.');
                    return;
                }
                else if(gridData[i].schType == '') {
                    rUtil.alert('스케줄 타입을 선택해주세요.');
                    return;
                }
                else if(gridData[i].schValue == '') {
                    rUtil.alert('스케줄 값을 입력해주세요.');
                    return;
                }
                else if(gridData[i].schActiveStartDt == '') {
                    rUtil.alert('스케줄 시작 일자를 입력해주세요.');
                    return;
                }
                else if(gridData[i].schActiveEndDt == '') {
                    rUtil.alert('스케줄 종료 일자를 입력해주세요.');
                    return;
                }
                else if(gridData[i].schActGroupSeq == '') {
                    rUtil.alert('스케줄 액션 그룹 명을 선택해주세요.');
                    return;
                }
                else if(gridData[i].useYn == '') {
                    rUtil.alert('사용 여부를 선택해주세요.');
                    return;
                }
            }

            var loData = {};
            loData.scmSeq = params.scmSeq;

            loData.addedRowItems = addedRowItems;
            loData.editedRowItems= editedRowItems;
            loData.removedRowItems= removedRowItems;

            rUtil.confirm('저장하시겠습니까?', function(data) {
                if(data == true){
                    rUtil.send({
                        method: 'POST',
                        url: '/rest/system/get-save_schMgt',
                        data: loData,
                        success: function(data) {
                            rUtil.alert("저장되었습니다.");
                            schMgtListGrid();
                        }
                    });
                }
            });

        }
    };
};
