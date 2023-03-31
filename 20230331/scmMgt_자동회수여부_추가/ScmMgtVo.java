package com.cuckoo.oms.core.vo.system;

import java.util.List;

import lombok.Data;

@Data
public class ScmMgtVo {

    // SCM 관리 : T_SCM_MGMT
    private String scmCd;                // SCM 코드
    private String scmNm;                // SCM 명
    private String scmCls;               // SCM 구분
    private String ifMth;                // 연동 방법
    private String aditConfirm;          // 추가 인증
    private String ovlapLoginYn;         // 중복로그인
    private String buyCollMth;           // 주문수집방법
    private String itmCoding;            // 상품 코딩
    private String delvryTmplat;         // 배송 템플릿
    private String apiOfr;               // API 제공
    private String ctgry;                // 카테고리
    private String delvryDomesticBuy;    // 택배 내수 주문
    private String delvryMvmnBuy;        // 택배 이동 주문
    private String fitBuy;               // 설치 주문
    private String logisDomesticBuy;     // 물류 내수 주문
    private String logisMvmnBuy;         // 물류 이동 주문
    private String fitDomesticBuy;       // 설치 내수 주문
    private int sortOrder;               // 정렬 순서
    private String remark;               // 비고
    private String useYn;                // 사용 여부
    private String regId;                // 등록 ID
    private String regIp;                // 등록 IP
    private String regDttm;              // 등록 일시
    private String updId;                // 수정 ID
    private String updIp;                // 수정 IP
    private String updDttm;              // 수정 일시
    private String fitOrderYn;           // 설치지시여부
    private String remarkConfYn;         // 비고확인여부
    private String ncodeConfYn;          // N코드확인여부
    private String autoWaybillSandYn;    // 자동운송장발송여부
    private String packingMgmtYn;        // 패킹사용여부
    private String autoReturnYn;         // 2023년 03월 31일 자동회수여부 추가

    // 공통코드 관리 : T_COMMCD_MGMT
    private String cd;                      // 코드
    private String upCd;                    // 상위 코드
    private String cdNm;                    // 코드 명

    private List<ScmMgtVo> scmList;             // SCM 수정정보 리스트

    private List<ScmMgtVo>addList;
    private List<ScmMgtVo>updateList;
    private List<ScmMgtVo>removeList;

}
