package com.cuckoo.oms.core.mapper.oracle.system;

import java.util.HashMap;
import java.util.List;

import com.cuckoo.oms.core.configuration.OracleConnectionMapper;
import com.cuckoo.oms.core.vo.system.ScmMgtVo;

@OracleConnectionMapper
public interface ScmMgtMapper {

    // SCM 목록 그리드 : 조회 (HashMap으로 변경)
    public List<ScmMgtVo> scmListGrid(HashMap vo);

    // SCM 목록 그리드 : 저장 : 신규/수정
    public int save_scmListGrid(ScmMgtVo vo);

    // SCM 목록 그리드 : 삭제
    public int del_scmListGrid(ScmMgtVo vo);

    // SCM 목록 그리드 : SCM 구분 셀렉트 박스
    public List<ScmMgtVo> scmClsList(ScmMgtVo vo);

    // SCM 목록 그리드 : 연동 방법 셀렉트 박스
    public List<ScmMgtVo> ifMthList(ScmMgtVo vo);

    // SCM 목록 그리드 : 추가 인증 셀렉트 박스
    public List<ScmMgtVo> aditConfirmList(ScmMgtVo vo);

    // SCM 목록 그리드 : 셀렉트 박스 : 사용 여부
    public List<ScmMgtVo> useYnList(ScmMgtVo vo);

    // SCM 삭제 가능여부 체크
    public String del_scmListGridCheck(ScmMgtVo vo);

}
