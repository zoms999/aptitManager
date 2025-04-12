
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.Mwd_accountScalarFieldEnum = {
  ac_id: 'ac_id',
  ac_pw: 'ac_pw',
  ac_use: 'ac_use',
  ac_insert_date: 'ac_insert_date',
  ac_leave_date: 'ac_leave_date',
  ac_gid: 'ac_gid',
  ins_seq: 'ins_seq',
  pe_seq: 'pe_seq',
  ac_expire_date: 'ac_expire_date',
  ac_terms_use: 'ac_terms_use',
  ac_terms_person: 'ac_terms_person',
  ac_terms_event: 'ac_terms_event'
};

exports.Prisma.Mwd_account_inquiryScalarFieldEnum = {
  ai_seq: 'ai_seq',
  ai_date: 'ai_date',
  ai_title: 'ai_title',
  ai_delete: 'ai_delete',
  ai_contents: 'ai_contents',
  ins_seq: 'ins_seq',
  ai_reply: 'ai_reply'
};

exports.Prisma.Mwd_account_memoScalarFieldEnum = {
  acm_memo: 'acm_memo',
  acm_date: 'acm_date',
  ac_gid: 'ac_gid'
};

exports.Prisma.Mwd_answerScalarFieldEnum = {
  qu_code: 'qu_code',
  anp_seq: 'anp_seq',
  an_ex: 'an_ex',
  an_wei: 'an_wei',
  an_progress: 'an_progress'
};

exports.Prisma.Mwd_answer_progressScalarFieldEnum = {
  anp_seq: 'anp_seq',
  anp_start_date: 'anp_start_date',
  anp_end_date: 'anp_end_date',
  anp_done: 'anp_done',
  qu_code: 'qu_code',
  ac_gid: 'ac_gid',
  anp_step: 'anp_step',
  cr_seq: 'cr_seq'
};

exports.Prisma.Mwd_choice_resultScalarFieldEnum = {
  cr_duty: 'cr_duty',
  cr_study: 'cr_study',
  cr_subject: 'cr_subject',
  cr_image: 'cr_image',
  ac_gid: 'ac_gid',
  cr_seq: 'cr_seq',
  pd_num: 'pd_num',
  pd_kind: 'pd_kind',
  pd_price: 'pd_price',
  cr_paymentdate: 'cr_paymentdate',
  ins_seq: 'ins_seq',
  tur_seq: 'tur_seq',
  cr_pay: 'cr_pay'
};

exports.Prisma.Mwd_common_codeScalarFieldEnum = {
  coc_code: 'coc_code',
  coc_explain: 'coc_explain',
  coc_use: 'coc_use',
  coc_order: 'coc_order',
  coc_code_name: 'coc_code_name',
  coc_group: 'coc_group',
  coc_group_name: 'coc_group_name'
};

exports.Prisma.Mwd_dutyScalarFieldEnum = {
  du_code: 'du_code',
  du_name: 'du_name',
  du_use: 'du_use',
  du_outline: 'du_outline',
  du_department: 'du_department'
};

exports.Prisma.Mwd_image_job_mapScalarFieldEnum = {
  jo_code: 'jo_code',
  qu_code: 'qu_code'
};

exports.Prisma.Mwd_instituteScalarFieldEnum = {
  ins_license_num: 'ins_license_num',
  ins_identity_num: 'ins_identity_num',
  ins_ceo: 'ins_ceo',
  ins_postcode: 'ins_postcode',
  ins_road_addr: 'ins_road_addr',
  ins_jibun_addr: 'ins_jibun_addr',
  ins_detail_addr: 'ins_detail_addr',
  ins_extra_addr: 'ins_extra_addr',
  ins_name: 'ins_name',
  ins_tel1: 'ins_tel1',
  ins_tel2: 'ins_tel2',
  ins_fax1: 'ins_fax1',
  ins_business: 'ins_business',
  ins_business_detail: 'ins_business_detail',
  ins_manager1_name: 'ins_manager1_name',
  ins_manager1_cellphone: 'ins_manager1_cellphone',
  ins_manager1_email: 'ins_manager1_email',
  ins_manager2_name: 'ins_manager2_name',
  ins_manager2_cellphone: 'ins_manager2_cellphone',
  ins_manager2_email: 'ins_manager2_email',
  ins_seq: 'ins_seq',
  ins_bill_email: 'ins_bill_email',
  ins_manager1_team: 'ins_manager1_team',
  ins_manager1_position: 'ins_manager1_position',
  ins_manager2_team: 'ins_manager2_team',
  ins_manager2_position: 'ins_manager2_position',
  ins_url_code: 'ins_url_code'
};

exports.Prisma.Mwd_institute_turnScalarFieldEnum = {
  ins_seq: 'ins_seq',
  tur_seq: 'tur_seq',
  tur_use: 'tur_use',
  tur_count: 'tur_count',
  tur_req_sum: 'tur_req_sum',
  tur_use_sum: 'tur_use_sum',
  tur_code: 'tur_code'
};

exports.Prisma.Mwd_jobScalarFieldEnum = {
  jo_code: 'jo_code',
  jo_name: 'jo_name',
  jo_outline: 'jo_outline',
  jo_use: 'jo_use',
  jo_mainbusiness: 'jo_mainbusiness'
};

exports.Prisma.Mwd_job_major_mapScalarFieldEnum = {
  ma_code: 'ma_code',
  jo_code: 'jo_code'
};

exports.Prisma.Mwd_majorScalarFieldEnum = {
  ma_code: 'ma_code',
  ma_name: 'ma_name',
  ma_explain: 'ma_explain',
  ma_use: 'ma_use'
};

exports.Prisma.Mwd_managerScalarFieldEnum = {
  mg_use: 'mg_use',
  mg_email: 'mg_email',
  mg_pw: 'mg_pw',
  mg_seq: 'mg_seq',
  mg_name: 'mg_name',
  mg_cellphone: 'mg_cellphone',
  mg_contact: 'mg_contact',
  mg_postcode: 'mg_postcode',
  mg_jibun_addr: 'mg_jibun_addr',
  mg_road_addr: 'mg_road_addr',
  mg_detail_addr: 'mg_detail_addr',
  mg_extra_addr: 'mg_extra_addr',
  mg_grant_account: 'mg_grant_account',
  mg_grant_result: 'mg_grant_result',
  mg_grant_manager: 'mg_grant_manager',
  mg_grant_log: 'mg_grant_log',
  mg_grant_statistic: 'mg_grant_statistic',
  mg_grant_inquiry: 'mg_grant_inquiry',
  mg_grant_institute: 'mg_grant_institute'
};

exports.Prisma.Mwd_personScalarFieldEnum = {
  pe_name: 'pe_name',
  pe_birth_year: 'pe_birth_year',
  pe_birth_month: 'pe_birth_month',
  pe_birth_day: 'pe_birth_day',
  pe_sex: 'pe_sex',
  pe_cellphone: 'pe_cellphone',
  pe_contact: 'pe_contact',
  pe_email: 'pe_email',
  pe_postcode: 'pe_postcode',
  pe_road_addr: 'pe_road_addr',
  pe_jibun_addr: 'pe_jibun_addr',
  pe_detail_addr: 'pe_detail_addr',
  pe_extra_addr: 'pe_extra_addr',
  pe_ur_education: 'pe_ur_education',
  pe_ur_job: 'pe_ur_job',
  pe_seq: 'pe_seq',
  pe_school_name: 'pe_school_name',
  pe_school_major: 'pe_school_major',
  pe_school_year: 'pe_school_year',
  pe_job_name: 'pe_job_name',
  pe_job_detail: 'pe_job_detail'
};

exports.Prisma.Mwd_productScalarFieldEnum = {
  pd_num: 'pd_num',
  pd_price: 'pd_price',
  pd_dc: 'pd_dc',
  pd_name: 'pd_name',
  pd_type: 'pd_type',
  pd_quota: 'pd_quota',
  pd_virtual_expire_at: 'pd_virtual_expire_at',
  pd_use: 'pd_use',
  pd_kind: 'pd_kind'
};

exports.Prisma.Mwd_questionScalarFieldEnum = {
  qu_code: 'qu_code',
  qu_kind1: 'qu_kind1',
  qu_kind2: 'qu_kind2',
  qu_kind3: 'qu_kind3',
  qu_order: 'qu_order',
  qu_use: 'qu_use',
  qu_ex1wei: 'qu_ex1wei',
  qu_ex2wei: 'qu_ex2wei',
  qu_ex3wei: 'qu_ex3wei',
  qu_ex4wei: 'qu_ex4wei',
  qu_ex5wei: 'qu_ex5wei',
  qu_explain: 'qu_explain',
  qu_ex6wei: 'qu_ex6wei',
  qu_filename: 'qu_filename',
  qu_qusyn: 'qu_qusyn',
  qu_action: 'qu_action'
};

exports.Prisma.Mwd_question_attrScalarFieldEnum = {
  qua_code: 'qua_code',
  qua_name: 'qua_name',
  qua_totalscore: 'qua_totalscore',
  qua_cutline: 'qua_cutline',
  qua_order: 'qua_order',
  qua_type: 'qua_type'
};

exports.Prisma.Mwd_question_explainScalarFieldEnum = {
  que_explain: 'que_explain',
  qua_code: 'qua_code',
  que_switch: 'que_switch'
};

exports.Prisma.Mwd_resdutyScalarFieldEnum = {
  anp_seq: 'anp_seq',
  red_kind: 'red_kind',
  red_code: 'red_code',
  red_rank: 'red_rank',
  red_cnt: 'red_cnt'
};

exports.Prisma.Mwd_resjobScalarFieldEnum = {
  anp_seq: 'anp_seq',
  rej_kind: 'rej_kind',
  rej_code: 'rej_code',
  rej_rank: 'rej_rank',
  rej_quacode: 'rej_quacode',
  rej_cnt: 'rej_cnt'
};

exports.Prisma.Mwd_resvalScalarFieldEnum = {
  anp_seq: 'anp_seq',
  rv_tnd1: 'rv_tnd1',
  rv_tnd2: 'rv_tnd2',
  rv_thk1: 'rv_thk1',
  rv_thk2: 'rv_thk2',
  rv_thktscore: 'rv_thktscore',
  rv_tal1: 'rv_tal1',
  rv_tal2: 'rv_tal2',
  rv_tal3: 'rv_tal3',
  rv_tal4: 'rv_tal4',
  rv_tal5: 'rv_tal5',
  rv_tal6: 'rv_tal6',
  rv_tal7: 'rv_tal7',
  rv_imgresrate: 'rv_imgresrate',
  rv_imgtcnt: 'rv_imgtcnt',
  rv_imgrcnt: 'rv_imgrcnt',
  rv_tnd3: 'rv_tnd3'
};

exports.Prisma.Mwd_score1ScalarFieldEnum = {
  sc1_step: 'sc1_step',
  qua_code: 'qua_code',
  anp_seq: 'anp_seq',
  sc1_score: 'sc1_score',
  sc1_rate: 'sc1_rate',
  sc1_rank: 'sc1_rank',
  sc1_resrate: 'sc1_resrate',
  sc1_qcnt: 'sc1_qcnt'
};

exports.Prisma.Mwd_studyway_rateScalarFieldEnum = {
  qua_code: 'qua_code',
  sw_type: 'sw_type',
  sw_kind: 'sw_kind',
  sw_kindname: 'sw_kindname',
  sw_rate: 'sw_rate',
  sw_color: 'sw_color'
};

exports.Prisma.Mwd_talent_job_mapScalarFieldEnum = {
  tjm_code1: 'tjm_code1',
  tjm_code2: 'tjm_code2',
  tjm_code3: 'tjm_code3',
  tjm_code4: 'tjm_code4',
  jo_code: 'jo_code'
};

exports.Prisma.Mwd_talent_tendency_mapScalarFieldEnum = {
  ttm_code1: 'ttm_code1',
  ttm_code2: 'ttm_code2'
};

exports.Prisma.Mwd_tendency_duty_mapScalarFieldEnum = {
  tdm_code1: 'tdm_code1',
  tdm_code2: 'tdm_code2',
  du_code: 'du_code',
  tdm_code3: 'tdm_code3',
  tdm_code4: 'tdm_code4',
  tdm_code5: 'tdm_code5'
};

exports.Prisma.Mwd_tendency_job_mapScalarFieldEnum = {
  tjm_code1: 'tjm_code1',
  tjm_code2: 'tjm_code2',
  tjm_code3: 'tjm_code3',
  jo_code: 'jo_code'
};

exports.Prisma.Mwd_tendency_studyScalarFieldEnum = {
  tes_study_tendency: 'tes_study_tendency',
  tes_study_way: 'tes_study_way',
  qua_code: 'qua_code',
  tes_study_type: 'tes_study_type'
};

exports.Prisma.Mwd_tendency_subject_mapScalarFieldEnum = {
  tsm_subject_code: 'tsm_subject_code',
  tsm_subject: 'tsm_subject',
  tsm_subject_group: 'tsm_subject_group',
  tsm_subject_choice: 'tsm_subject_choice',
  tsm_communication_type: 'tsm_communication_type',
  tsm_creation_type: 'tsm_creation_type',
  tsm_practical_type: 'tsm_practical_type',
  tsm_sports_type: 'tsm_sports_type',
  tsm_norm_type: 'tsm_norm_type',
  tsm_inference_type: 'tsm_inference_type',
  tsm_production_type: 'tsm_production_type',
  tsm_life_type: 'tsm_life_type',
  tsm_analysis_type: 'tsm_analysis_type',
  tsm_observation_type: 'tsm_observation_type',
  tsm_principle_type: 'tsm_principle_type',
  tsm_service_type: 'tsm_service_type',
  tsm_education_type: 'tsm_education_type',
  tsm_multiplex_type: 'tsm_multiplex_type',
  tsm_adventurous_type: 'tsm_adventurous_type',
  tsm_use: 'tsm_use',
  tsm_subject_explain: 'tsm_subject_explain',
  tsm_subject_group_code: 'tsm_subject_group_code',
  tsm_subject_choice_code: 'tsm_subject_choice_code'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  mwd_account: 'mwd_account',
  mwd_account_inquiry: 'mwd_account_inquiry',
  mwd_account_memo: 'mwd_account_memo',
  mwd_answer: 'mwd_answer',
  mwd_answer_progress: 'mwd_answer_progress',
  mwd_choice_result: 'mwd_choice_result',
  mwd_common_code: 'mwd_common_code',
  mwd_duty: 'mwd_duty',
  mwd_image_job_map: 'mwd_image_job_map',
  mwd_institute: 'mwd_institute',
  mwd_institute_turn: 'mwd_institute_turn',
  mwd_job: 'mwd_job',
  mwd_job_major_map: 'mwd_job_major_map',
  mwd_major: 'mwd_major',
  mwd_manager: 'mwd_manager',
  mwd_person: 'mwd_person',
  mwd_product: 'mwd_product',
  mwd_question: 'mwd_question',
  mwd_question_attr: 'mwd_question_attr',
  mwd_question_explain: 'mwd_question_explain',
  mwd_resduty: 'mwd_resduty',
  mwd_resjob: 'mwd_resjob',
  mwd_resval: 'mwd_resval',
  mwd_score1: 'mwd_score1',
  mwd_studyway_rate: 'mwd_studyway_rate',
  mwd_talent_job_map: 'mwd_talent_job_map',
  mwd_talent_tendency_map: 'mwd_talent_tendency_map',
  mwd_tendency_duty_map: 'mwd_tendency_duty_map',
  mwd_tendency_job_map: 'mwd_tendency_job_map',
  mwd_tendency_study: 'mwd_tendency_study',
  mwd_tendency_subject_map: 'mwd_tendency_subject_map'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
