import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { set, useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as APIURL from "../../service/string/apiUrl";
import * as TOA from "../../service/library/toast";

export default function ServiceModalPayment({ click, setClick, pid, payment }) {
  // useParams를 사용하여 URL 파라미터 가져오기
  const { cid, uid } = useParams();
  const [ruid, setRuid] = useState(null);

  const { register, setValue, getValues, watch, formState: { errors }} = useForm({
    defaultValues: {},
  });
  const [localSelectedPaymentValue, setLocalSelectedPaymentValue] =
    useState("선택");
  const [selectedBankValue, setSelectedBankValue] = useState("");
  const [formattedAmount, setFormattedAmount] = useState("");
  const [formattedCardNum, setFormattedCardNum] = useState("");
  const [formattedExpDate, setFormattedExpDate] = useState("");
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState("");
  const [formattedRegistration, setFormattedRegistration] = useState("");
  const [formattedBirthDate, setFormattedBirthDate] = useState("");
  const [formattedCmsNum, setFormattedCmsNum] = useState("");
  const [formattedAccountNum, setFormattedAccountNum] = useState("");
  const [additionalBankName, setAdditionalBankName] = useState("");
  const [hasShownNumericToast, setHasShownNumericToast] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [hyosungBankName, setHyosungBankName] = useState("");
  const [bankChangedManually, setBankChangedManually] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState("");
  const [currentBankOptions, setCurrentBankOptions] = useState([]);
  const [cmsBankName, setCmsBankName] = useState("");
  const [installment, setInstallment] = useState("");
  const [installmentMonths, setInstallmentMonths] = useState("");
  const [formattedApprovalNum, setFormattedApprovalNum] = useState("");
  const [remark, setRemark] = useState("");
  const [availablePaymentOptions, setAvailablePaymentOptions] = useState([]);
  const [originalAmount, setOriginalAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");

  const handleRemarkChange = (e) => {
    setValue("_remark", e.target.value);
  };

  const paymentMethodToBanks = {
    신용카드: ["신한 가맹점", "BC 가맹점", "효성 ( 카드사 )"],
    무통장입금: ["기업", "국민", "농협"],
  };

    const bankAccountNumbers = {
    기업: "232-102860-01-011",
    국민: "292-01-0023-290",
    농협: "131-17-004933",
  };

  const handleChargeTypeChange = (e) => {
    const selectedChargeType = e.target.value;
    setValue("_chargeType", selectedChargeType);

    if (selectedChargeType === "월 이용료 ( 후불 )") {
      setAvailablePaymentOptions(["신용카드", "CMS ( 자동이체 )"]);
    } else {
      setAvailablePaymentOptions([
        "신용카드",
        "CMS ( 자동이체 )",
        "무통장입금",
      ]);
    }
  };
  const getNextMonthDate = (day) => {
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 2;

    if (month > 11) {
      year += 1;
      month %= 12;
    }

    const nextMonth = new Date(year, month, day);
    nextMonth.setDate(nextMonth.getDate() + 1);
    return nextMonth.toISOString().split("T")[0];
  };

  const cmsPaymentDateOptions = [
    getNextMonthDate(5),
    getNextMonthDate(10),
    getNextMonthDate(15),
  ];

  const [paymentDateLabel, setPaymentDateLabel] = useState("결제일");
  const [creditCardPaymentDate, setCreditCardPaymentDate] = useState(
    getNextMonthDate(5)
  );
  const [cmsPaymentDate, setCmsPaymentDate] = useState(
    cmsPaymentDateOptions[0]
  );
  const watchedPaymentMethod = watch("_payment");

  const handlePaymentMethodChange = useCallback(
    (e) => {
      const paymentMethod = e.target.value;
      setValue("_payment", paymentMethod);

      const chargeType = watch("_chargeType");

      if (chargeType === "월 이용료 ( 후불 )") {
        setPaymentDateLabel("월 이용료 청구일");
        if (paymentMethod === "신용카드") {
          const nextMonthDate = getNextMonthDate(5);
          const nextNextMonthDate = getNextMonthDate(
            new Date(nextMonthDate).getDate()
          );
          setCreditCardPaymentDate(nextNextMonthDate);
          setValue("_paymentDate", nextNextMonthDate);
        } else if (paymentMethod === "CMS ( 자동이체 )") {
          setCmsPaymentDate(cmsPaymentDateOptions[0]);
          setValue("_paymentDate", cmsPaymentDateOptions[0]);
        }
      }

      if (
        chargeType === "월 이용료 ( 후불 )" &&
        paymentMethod === "CMS ( 자동이체 )"
      ) {
        setPaymentDateLabel("월 이용료 청구일");
      } else if (chargeType === "월 이용료 ( 후불 )") {
        setPaymentDateLabel("월 이용료 청구일");
      } else {
        switch (paymentMethod) {
          case "신용카드":
            setPaymentDateLabel("승인일");
            break;
          case "무통장입금":
            setPaymentDateLabel("입금일");
            break;
          case "CMS ( 자동이체 )":
            setPaymentDateLabel("출금일");
            break;
          default:
            setPaymentDateLabel("결제일");
            break;
        }
      }
    },
    [setValue, watch]
  );

  useEffect(() => {
    const chargeType = watch("_chargeType");
    if (chargeType !== "월 이용료 ( 후불 )") {
      setValue("_paymentMethod", "");
    }
  }, [watch("_chargeType"), setValue]);

  useEffect(() => {
    const chargeType = watch("_chargeType");
    const paymentMethod = watch("_payment");
    const paymentMethodType = watch("_paymentMethod");

    if (chargeType === "월 이용료 ( 후불 )") {
      if (paymentMethod === "신용카드" && paymentMethodType === "분납") {
        setPaymentDateLabel("월 이용료 청구일");
        setValue("_paymentDate", creditCardPaymentDate);
      } else if (paymentMethod === "CMS ( 자동이체 )") {
        setPaymentDateLabel("월 이용료 청구일");
        setValue("_paymentDate", cmsPaymentDate);
      }
    }
  }, [
    watch("_chargeType"),
    watch("_payment"),
    watch("_paymentMethod"),
    setValue,
    creditCardPaymentDate,
    cmsPaymentDate,
  ]);

  //일시불, 할부 핸들러
  const handleInstallmentChange = (event) => {
    const value = event.target.value;
    setInstallment(value);
    if (value === "일시불") {
      setValue("paymentType", "0");
      setInstallmentMonths("0");
      setValue("installmentMonths", "0");
    } else {
      setValue("paymentType", "1");
    }
  };

  const handleInstallmentMonthsChange = (event) => {
    const value = event.target.value;
    setInstallmentMonths(value);
    setValue("installmentMonths", value);
  };

  useEffect(() => {
    const paymentMethod = watch("_payment");
    handlePaymentMethodChange({ target: { value: paymentMethod } });
  }, [watch("_payment"), watch("_chargeType")]);

  useEffect(() => {
    setCurrentPaymentMethod(watchedPaymentMethod);
    const banksForMethod = paymentMethodToBanks[watchedPaymentMethod] || [];
    setCurrentBankOptions(banksForMethod);
    if (banksForMethod.length > 0 && !selectedBankValue) {
      setSelectedBankValue(banksForMethod[0]);
      if (watchedPaymentMethod === "무통장입금") {
        const accountNumber = bankAccountNumbers[banksForMethod[0]] || "";
        console.log("accountNumber:", accountNumber);
        setFormattedAccountNum(accountNumber);
        setValue("_accountNum", accountNumber);
      }
    } else if (!banksForMethod.includes(selectedBankValue)) {
      setSelectedBankValue("");
      setFormattedAccountNum("");
      // setValue("_accountNum", "");
    }
  }, [watchedPaymentMethod, selectedBankValue]);

  // cms은행명 입력 핸들러
  const handleCmsBankNameChange = (event) => {
    const value = event.target.value.trim();
    const formattedValue =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setCmsBankName(formattedValue);
  };


  // 날짜 형식을 ISO로 변환
  const formatDateToISO = (date) => {
    return date ? date.split("T")[0] : null;
  };

  // 입력 변경 핸들러 팩토리 함수
  const handleInputChange =
    (
      formatRules,
      maxLength,
      setValueFunc,
      setFormattedValueFunc,
      numericOnly = false,
      validationCheck = null,
      field = null
    ) =>
    (e) => {
      // e.target.value에서 '-' 와 '/' 문자를 제거
      let value = e.target.value.replace(/[-/]/g, "");

      // e.target.value에서 '-' 와 '/' 문자를 제거
      if (numericOnly) {
        const numericRegex = /^[0-9]*$/;
        if (!numericRegex.test(value)) {
          if (field && !numericFieldsToastShown[field]) {
            setNumericFieldsToastShown({
              ...numericFieldsToastShown,
              [field]: true,
            });
          }
          return;
        } else {
          setNumericFieldsToastShown({
            ...numericFieldsToastShown,
            [field]: false,
          });
        }
      }

      // 입력값의 길이가 maxLength를 초과하면 함수를 종료
      if (value.length > maxLength) {
        return;
      }
      setValueFunc(value);

      if (validationCheck && !validationCheck(value)) {
        TOA.servicesUseToast("입력해주세요.", "s");
        return;
      }

      // formattedValue는 포맷규칙을 적용한 최종 문자열
      let formattedValue = "";
      for (let i = 0; i < value.length; i++) {
        // i번째 위치에 삽입할 특수문자가 있다면 formattedValue에 추가
        if (formatRules[i]) {
          // 그 다음, value의 i번째 문자를 formattedValue에 추가
          formattedValue += formatRules[i];
        }
        formattedValue += value[i];
      }
      if (value.length > maxLength) {
        value = value.substring(0, maxLength);
        return;
      }
      console.log("Formatted Value:", formattedValue);
      setFormattedValueFunc(formattedValue);
    };

  // useCallback을 이용해 불필요한 렌더링을 최소화
  const handleCardNumChange = useCallback(
    handleInputChange(
      { 4: "-", 8: "-", 12: "-" },
      16,
      (val) => setValue("_cardnum", val),
      setFormattedCardNum,
      true,
      null,
      "_cardnum"
    ),
    []
  );

  const handleExpDateChange = useCallback(
    handleInputChange(
      { 2: "/" },
      4,
      (val) => setValue("_cardValidnum", val),
      setFormattedExpDate,
      true,
      null
    ),
    "_cardValidnum",
    []
  );

  const handleBirthDateChange = useCallback(
    handleInputChange(
      { 4: "/", 6: "/" },
      8,
      (val) => setValue("_birthDate", val),
      setFormattedBirthDate,
      true,
      null,
      "_birthDate"
    ),
    []
  );

  const handleBusinessNumberChange = useCallback(
    handleInputChange(
      { 3: "-", 5: "-" },
      10,
      (val) => setValue("_registration", val),
      setFormattedRegistration,
      true,
      null,
      "_registration"
    ),
    []
  );

  const handleCMSNumChange = useCallback(
    handleInputChange(
      {},
      8,
      (val) => setValue("_cmsNum", val),
      setFormattedCmsNum,
      true,
      null,
      "_cmsNum"
    ),
    []
  );

  const handleAccountNumChange = useCallback(
    handleInputChange(
      {},
      20,
      (val) => setValue("_accountNum", val),
      setFormattedAccountNum,
      true,
      null,
      "_accountNum"
    ),
    []
  );

  const handlePhoneNumberChange = useCallback(
    (e) => {
      let value = e.target.value.replace(/-/g, "");
      const numericRegex = /^[0-9]*$/;
      if (value.length > 11) {
        return;
      }
      if (!numericRegex.test(value)) {
        if (!hasShownNumericToast) {
          TOA.servicesUseToast("휴대폰 번호를 입력해주세요.", "e");
          setHasShownNumericToast(true);
        }
        return;
      } else {
        setHasShownNumericToast(false);
      }
      if (value.length === 10) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      } else if (value.length === 11) {
        value = value.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
      }
      setFormattedPhoneNumber(value);
      setValue("_telnum", value);
    },
    [hasShownNumericToast]
  );

  const handleKTNumChange = useCallback((e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 입력 허용
    if (value.length > 11) {
      value = value.slice(0, 11); // 최대 11자리까지 입력 허용
    }

    if (value.length > 7) {
      if (value.startsWith("02")) {
        // 서울 지역번호 '02'인 경우
        if (value.length === 10) {
          value = value.replace(/^(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
        } else {
          value = value.replace(/^(\d{2})(\d{3})(\d{4})/, "$1-$2-$3");
        }
      } else {
        // 다른 지역번호 (3자리)
        if ((value[3] === "0" || value[3] === "1") && value.length === 10) {
          value = value.replace(/^(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        } else if (value.length === 10) {
          // 중간번호가 3자리 시작 (031-962-2312)
          value = value.replace(/^(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        } else {
          value = value.replace(/^(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        }
      }
    } else if (value.length > 4) {
      if (value.startsWith("02")) {
        // 서울 지역번호 '02'인 경우
        value = value.replace(/^(\d{2})(\d{1,4})/, "$1-$2");
      } else {
        value = value.replace(/^(\d{3})(\d{1,3})/, "$1-$2");
      }
    }

    setValue("_ktNum", value); // Form에 값을 설정
  }, []);

  //최초 알림창 register 변수 저장
  const [toastShownState, setToastShownState] = useState({
    _name: false,
    _relationship: false,
  });
  const [numericFieldsToastShown, setNumericFieldsToastShown] = useState({
    _birthDate: false,
    _registration: false,
    _accountNum: false,
    _cmsNum: false,
    _cardnum: false,
    _cardValidnum: false,
  });

  // 금액 입력 핸들러 (원 단위로 변환)
  const handleOriginalAmountChange = (e) => {
    const paymentPlan = watch("_paymentPlan"); 
  
    if (paymentPlan === "무료") {
      setOriginalAmount("0"); 
      setValue("_amount", "0");
      setFinalAmount("0");
      setValue("_finalAmount", "0");
      setDiscountAmount("0");
    } else {
      let rawValue = e.target.value.replace(/[^0-9]/g, "");
      if (rawValue) {
        let formattedValue = parseInt(rawValue, 10).toLocaleString();
        setOriginalAmount(formattedValue);
        setValue("_amount", rawValue);
  
        // 정상 가격 입력 시 할인된 금액도 동일하게 설정
        setFinalAmount(formattedValue);
        setValue("_finalAmount", rawValue);
  
        // 할인 금액 계산 (항상 0으로 설정)
        setDiscountAmount("0"); 
      } else {
        setOriginalAmount("");
        setValue("_amount", "");
        setFinalAmount("");
        setValue("_finalAmount", "");
        setDiscountAmount("");
      }
    }
  };

  const handleFinalAmountChange = (e) => {
    const paymentPlan = watch("_paymentPlan");

    if (paymentPlan === "무료") {
      setFinalAmount("0");
      setValue("_finalAmount", "0");
    } else {
      let rawValue = e.target.value.replace(/[^0-9]/g, "");
      if (rawValue) {
        let formattedValue = parseInt(rawValue, 10).toLocaleString();
        setFinalAmount(formattedValue);
        setValue("_finalAmount", rawValue);
        calculateDiscount(originalAmount.replace(/,/g, ""), rawValue);
      } else {
        setFinalAmount("");
        setValue("_finalAmount", "");
        setDiscountAmount("");
      }
    }
  };

  const calculateDiscount = (original, final) => {
    const orig = parseInt(original, 10) || 0;
    const fin = parseInt(final, 10) || 0;
    const discount = orig - fin;
  
    setFinalAmount(fin.toLocaleString());
    setValue("_finalAmount", fin.toString());
    setDiscountAmount(discount.toLocaleString());
  };

  // 사업자번호 입력 핸들러
  const handleBusinessNumChange = useCallback(
    (e) => {
      const { value } = e.target;
      let formattedValue = value.replace(/[^0-9]/g, "");
      if (watch("_comType") === "법인") {
        // 법인번호는 보통 13자리
        formattedValue = formattedValue.slice(0, 13);
        // 일반적인 법인번호 포맷: 000000-0000000
        if (formattedValue.length > 6) {
          formattedValue = `${formattedValue.slice(
            0,
            6
          )}-${formattedValue.slice(6)}`;
        }
      } else {
        // 사업자번호는 10자리
        formattedValue = formattedValue.slice(0, 10);
        // 일반적인 사업자번호 포맷: 000-00-00000
        if (formattedValue.length > 5) {
          formattedValue = `${formattedValue.slice(
            0,
            3
          )}-${formattedValue.slice(3, 5)}-${formattedValue.slice(5)}`;
        }
      }
      setFormattedRegistration(formattedValue);
      setValue("_registration", formattedValue);
    },
    [watch("_comType")]
  );

  // 한글만 입력 가능한 핸들러
  const handleKoreanOnlyInput = (e, field) => {
    const value = e.target.value;
    const koreanOnlyRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣\s]*$/;
  
    // 입력된 값이 한글이라면
    if (koreanOnlyRegex.test(value)) {
      // 해당 필드의 값을 설정
      setValue(field, value);
  
      // TOA 메세지가 표시되지 않도록 상태를 업데이트
      setToastShownState({
        ...toastShownState,
        [field]: false,
      });
    } else {
      // 한글이 아닌 문자를 제거한 값을 설정
      const sanitizedValue = value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣\s]/g, "");
      setValue(field, sanitizedValue);
  
      // 해당 필드에 대한 TOA 메세지가 아직 표시되지 않았다면
      if (!toastShownState[field]) {
        TOA.servicesUseToast("한글로 입력해주세요.", "e");
  
        // TOA 메세지가 표시되었다고 상태를 업데이트
        setToastShownState({
          ...toastShownState,
          [field]: true,
        });
      }
    }
  };

  useEffect(() => {
    if (cid) {
      API.servicesPostData(APIURL.urlGetCompany, { cid: cid })
        .then((res) => {
          const IDNUM = res.data.ruid;
          setRuid(IDNUM);
        })
        .catch((error) => {
          console.error("Error fetching company data:", error);
        });
    }
  }, [cid]);

  const validateFields = () => {
    const paymentMethod = getValues("_payment");
    const amountedValue = getValues("_amount");
    const paymentPlan = watch("_paymentPlan");

    //누락된 필드 이름을 저장할 배열
    let missingFields = [];

    if (paymentPlan !== "무료") {
      if (!paymentMethod || paymentMethod === "선택") {
        missingFields.push("결제수단");
      } else {
        if (!amountedValue) {
          missingFields.push("금액");
        }
      }
    }

    if (missingFields.length > 0) {
      const missingFieldsStr = missingFields.join(", ");
      TOA.servicesUseToast(`${missingFieldsStr}을 입력해주세요.`, "e");
      return false;
    }

    return true;
  };

  const fnCheckModify = useCallback(() => {
    if (pid) {
      API.servicesPostData(APIURL.urlGetPayment, { pid: pid })
        .then((res) => {
          if (res.status === "success") {
            const paymentData = res.data;
  
            // 상태 설정
            setValue("_chargeType", paymentData.chargeType);
            setValue("_paymentPlan", paymentData.paymentPlan);
            setValue("_payment", paymentData.payment);
            setValue("_paymentDate", formatDateToISO(paymentData.paymentDate));
            setValue("_startDate", formatDateToISO(paymentData.startDate));
            setValue("_endDate", formatDateToISO(paymentData.endDate));
            setValue("_chargeEndDate", formatDateToISO(paymentData.chargeEndDate));
            setValue("_name", paymentData.name);
            setValue("_relationship", paymentData.relationship);
            setValue("_birthDate", paymentData.birthDate);
            setValue("_registration", setFormattedRegistration(paymentData.registration));
            setValue("_telnum", setFormattedPhoneNumber(paymentData.telnum));
            setValue("_cmsNum", setFormattedCmsNum(paymentData.cmsNum));
            setValue("_ktNum", paymentData.ktNum);
            setValue("_remark", paymentData.remark);
            setValue("_amount", paymentData.amount + paymentData.discountAmount);
            setValue("_discountAmount", paymentData.discountAmount);

            setValue("_cardnum", paymentData.cardnum);
            setValue("_cardValidnum", paymentData.cardValidnum);
            setValue("_approvalNum", paymentData.approvalNum);
            setValue("_accountNum", paymentData.accountNum);
  
            setFormattedCardNum(paymentData.cardnum);
            setFormattedExpDate(paymentData.cardValidnum);
            setFormattedBirthDate(paymentData.birthDate);
            setFormattedApprovalNum(paymentData.approvalNum);
            setFormattedAccountNum(paymentData.accountNum);
            setCmsBankName(paymentData.useBank);
  
                      // 무통장입금 처리
            if (paymentData.payment === "무통장입금") {
              setSelectedBankValue(paymentData.useBank);
              const accountNumber = bankAccountNumbers[paymentData.useBank] || "";
              setFormattedAccountNum(accountNumber);
              setValue("_accountNum", accountNumber);
            } else {
              setFormattedAccountNum(paymentData.accountNum);
              setValue("_accountNum", paymentData.accountNum);
            }

            // 효성 ( 카드사 ) 처리
            if (paymentData.useBank.startsWith("효성 (")) {
              const match = paymentData.useBank.match(/효성 \((.*?)\)/);
              if (match) {
                setSelectedBankValue("효성 ( 카드사 )");
                setHyosungBankName(match[1].trim());
              }
            } else {
              setSelectedBankValue(paymentData.useBank);
              setHyosungBankName("");
            }

            setValue("_useBank", paymentData.useBank);
            setFormattedAmount(parseFloat(paymentData.amount).toLocaleString());
            setInstallment(paymentData.paymentType === "0" ? "일시불" : "할부");
            setInstallmentMonths(paymentData.installmentMonths);
  
            if (paymentData.paymentType === "1") {
              setInstallment("할부");
              setInstallmentMonths(paymentData.installmentMonths);
              setValue("installmentMonths", paymentData.installmentMonths);
            } else {
              setInstallment("일시불");
              setInstallmentMonths("0");
              setValue("installmentMonths", "0");
            }

            const originalAmount =
              parseFloat(paymentData.amount) +
              parseFloat(paymentData.discountAmount);
            setOriginalAmount(originalAmount.toLocaleString());
            setDiscountAmount(
              parseFloat(paymentData.discountAmount).toLocaleString()
            );
            setFinalAmount(parseFloat(paymentData.amount).toLocaleString());
          }
        })
        .catch((error) => {
          console.error("Error fetching payment data:", error);
        });
    }
  }, [pid]);
  
    // 은행 변경 핸들러
    const handleBankValueChange = (event) => {
      const bankName = event.target.value;
      setSelectedBankValue(bankName);
    
      if (watch("_payment") === "무통장입금") {
        const accountNumber = bankAccountNumbers[bankName] || "";
        setFormattedAccountNum(accountNumber);
        setValue("_accountNum", accountNumber);
      } else {
        if (bankName === "효성 ( 카드사 )") {
          setValue("_useBank", `효성 (${hyosungBankName})`);
        } else {
          setHyosungBankName("");
          setValue("_useBank", bankName);
        }
        setFormattedAccountNum(""); 
        setValue("_accountNum", ""); 
      }
    };

  useEffect(() => {
    if (click && pid) {
      fnCheckModify();
    }
  }, [click, pid, fnCheckModify]);
  
  useEffect(() => {
    if (currentPaymentMethod === "신용카드" && !installment) {
      setInstallment("일시불");
      setInstallmentMonths(0);
    }
  }, [currentPaymentMethod, installment]);

  // 폼 제출 핸들러
  function resetFormFields() {
    setValue("_chargeType", "");
    setValue("_paymentPlan", "");
    setValue("_payment", localSelectedPaymentValue);
    setValue("_paymentDate", "");
    setValue("_startDate", "");
    setValue("_endDate", "");
    setValue("_chargeEndDate", "");
    setValue("_name", "");
    setValue("_relationship", "");
    setValue("_cardnum", "");
    setValue("_cardValidnum", "");
    setValue("_birthDate", "");
    setValue("_registration", "");
    setValue("_comType", "");
    setValue("_telnum", "");
    setValue("_useBank", "");
    setValue("_amount", "");
    setValue("_discountAmount", "");
    setValue("_cmsNum", "");
    setValue("_accountNum", "");
    setValue("_ktNum", "");
    setValue("_approvalNum", "");
    setInstallment("일시불");
    setInstallmentMonths(0);
    setValue("_remark", "");
    setValue("_installmentMonths", "");
  }

  // 폼 제출 핸들러
  const fnSubmit = (e) => {
    e.preventDefault();

    // 선택된 결제수단 가져오기
    if (!validateFields()) {
      return;
    }

    const chargeType = getValues("_chargeType");

    if (!chargeType) {
      TOA.servicesUseToast("Please select a charge type.", "e");
      return;
    }

    // "_amount" 필드의 값을 가져와서 숫자 형태로 변환
    const amountValue = String(getValues("_amount"));
    const amountLong = Number(amountValue.replace(/,/g, ""));

    const paymentPlan = watch("_paymentPlan");

    // 날짜를 ISO 형식으로 변환하는 함수
    const formatISODate = (date) => {
      return date ? `${date}T17:45:00` : null;
    };

    // 각 날짜 필드의 값을 ISO 형식으로 변환
    let paymentDate = formatISODate(getValues("_paymentDate"));

    if (
      watch("_chargeType") === "월 이용료 ( 후불 )" &&
      watch("_payment") === "CMS ( 자동이체 )"
    ) {
      paymentDate = formatISODate(getValues("_paymentDate"));
    }

    if (
      watch("_chargeType") === "월 이용료 ( 후불 )" &&
      watch("_payment") === "신용카드" &&
      watch("_paymentMethod") === "분납"
    ) {
      setValue("_paymentDate", creditCardPaymentDate);
    }

    // data 객체 선언 (순서 변경)
    let data = {
      ruid: ruid,
      chargeType: chargeType,
      paymentPlan: paymentPlan,
      payment: currentPaymentMethod,
      paymentDate: paymentDate,
      amount:
        paymentPlan === "무료" ? 0 : Number(finalAmount.replace(/,/g, "")),
      discountAmount:
        paymentPlan === "무료" ? 0 : Number(discountAmount.replace(/,/g, "")),
      useBank: "",
      useFlag: 1,
      remark: remark,
    };

    // 선납일 경우 startDate, endDate 추가
    if (watch("_paymentPlan") === "선납") {
      data.startDate = formatISODate(getValues("_startDate"));
      data.endDate = formatISODate(getValues("_endDate"));
    }

    if (watch("_paymentPlan") === "분납") {
      data.chargeEndDate = formatISODate(getValues("_chargeEndDate"));
    }

    // useBankValue 설정 (순서 변경)
    let useBankValue = selectedBankValue;

    if (
      currentPaymentMethod === "신용카드" &&
      selectedBankValue === "효성 ( 카드사 )" &&
      hyosungBankName
    ) {
      useBankValue = `효성 ( ${hyosungBankName} )`;
    } else if (currentPaymentMethod === "CMS ( 자동이체 )") {
      useBankValue = cmsBankName;
  }

    // data.useBank 설정 (useBankValue 설정 후)
    data.useBank = useBankValue;

    if (!!pid) {
      data.pid = pid;
    }

    // 수정 시 부모 컴포넌트에게 할당 받은 pid를 사용하여 전달
    switch (currentPaymentMethod) {
      case "신용카드":
        Object.assign(data, {
          name: getValues("_name"),
          birthDate: getValues("_birthDate"),
          relationship: getValues("_relationship"),
          cardnum: getValues("_cardnum"),
          cardValidnum: getValues("_cardValidnum"),
          useBank: useBankValue,
          accountNum: getValues("_accountNum"),
          approvalNum: getValues("_approvalNum"),
          paymentType: installment === "일시불" ? "0" : "1",
          remark: getValues("_remark"),
          installmentMonths: installment === "일시불" ? "0" : getValues("installmentMonths"),
        });

        break;
      case "무통장입금":
        Object.assign(data, {
          useBank: useBankValue,
          name: getValues("_name"),
          remark: getValues("_remark"),
        });
        break;
      case "CMS ( 자동이체 )":
        Object.assign(data, {
          name: getValues("_name"),
          cmsNum: getValues("_cmsNum"),
          accountNum: getValues("_accountNum"),
          birthDate: getValues("_birthDate"),
          registration: getValues("_registration"),
          relationship: getValues("_relationship"),
          useBank: useBankValue,
          remark: getValues("_remark"),
        });
        break;

      case "KT합산청구":
        Object.assign(data, {
          name: getValues("_name"),
          ktNum: getValues("_ktNum"),
          relationship: getValues("_relationship"),
          birthDate: getValues("_birthDate"),
          registration: getValues("_registration"),
          telnum: getValues("_telnum"),
          comType: getValues("_comType"),
          remark: getValues("_remark"),
        });
        break;

      case "현금":
        Object.assign(data, {
          amount: amountLong,
          remark: getValues("_remark"),
        });
        break;
    }

    API.servicesPostData(APIURL.urlSetPayment, data)
      .then((res) => {
        setClick(false);
        resetFormFields();
        const amount = parseInt(res.data.amount, 10);
        const discountAmount = parseInt(res.data.discountAmount, 10);
        const finalAmount = amount - discountAmount;
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error submitting payment data:", error);
      });
    console.log("Form Data Before Submission:", data);
  };

  function resetFormFields() {
    setValue("_chargeType", "");
    setValue("_payment", localSelectedPaymentValue);
    setValue("_paymentDate", "");
    setValue("_startDate", "");
    setValue("_endDate", "");
    setValue("_name", "");
    setValue("_relationship", "");
    setValue("_cardnum", "");
    setValue("_cardValidnum", "");
    setValue("_birthDate", "");
    setValue("_registration", "");
    setValue("_comType", "");
    setValue("_telnum", "");
    setValue("_useBank", "");
    setValue("_amount", "");
    setValue("_discountAmount", "");
    setValue("_cmsNum", "");
    setValue("_accountNum", "");
    setValue("_ktNum", "");
    setInstallment("일시불");
    setInstallmentMonths(0);
    setValue("_remark", "");
  }

  const amountField = {
    label: "금액",
    type: "custom",
    customComponent: (
      <div style={{ marginLeft: "5px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <label
              htmlFor="_amount"
              style={{ marginRight: "15px", whiteSpace: "nowrap" }}
            >
              정상 가격
            </label>
            <input
              type="text"
              id="_amount"
              value={watch("_paymentPlan") === "무료" ? "0" : originalAmount}
              onChange={handleOriginalAmountChange}
              style={{
                flex: 1,
                marginRight: "10px",
                paddingRight: "25px",
                minWidth: "100px",
              }}
              disabled={watch("_paymentPlan") === "무료"}
            />
            <label htmlFor="discountAmount" style={{ marginRight: "8px", whiteSpace: "nowrap" }}>
              할인 금액
            </label>
            <input
              type="text"
              id="discountAmount"
              value={watch("_paymentPlan") === "무료" ? "0" : discountAmount}
              readOnly
              style={{
                flex: 1,
                minWidth: "100px", 
                backgroundColor: "#f5f5f5",
              }}
            />
          </div>
  
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <label htmlFor="finalAmount" style={{ marginRight: "4px", whiteSpace: "nowrap" }}>
              할인된 금액
            </label>
            <input
              type="text"
              id="finalAmount"
              value={watch("_paymentPlan") === "무료" ? "0" : finalAmount}
              onChange={handleFinalAmountChange}
              style={{
                flex: 1,
                paddingRight: "25px",
                minWidth: "100px",
              }}
            />
          </div>
        </div>
      </div>
    ),
  };

  // 폼의 각 필드와 설정을 배열로 관리
  const formFields = [
    watch("_chargeType") &&
      watch("_payment") &&
      watch("_paymentPlan") !== "무료" && {
        label: paymentDateLabel,
        type: "custom",
        customComponent: (
          <input 
            type="date" 
            max="9999-12-31" 
            id="paymentDate" 
            {...register("_paymentDate")} 
            readOnly={
              watch("_chargeType") === "월 이용료 ( 후불 )" &&
              (watch("_payment") === "신용카드" || watch("_payment") === "CMS ( 자동이체 )")
            }
          />
        ),
      },

    (watch("_chargeType") === "월 이용료 ( 후불 )" ||
      watch("_chargeType") === "가맹비 ( 선불 )") &&
      watch("_paymentPlan") === "분납" && {
        label: "요금 만료일",
        type:"custom",
        customComponent: (
          <input type="date" 
          max="9999-12-31" 
          id="chargeEndDate" 
          {...register("_chargeEndDate")} />
        ),
      },

    (watch("_chargeType") === "월 이용료 ( 후불 )" ||
      watch("_chargeType") === "가맹비 ( 선불 )") &&
      watch("_paymentPlan") === "선납" && {
        label: "선납 시작 / 종료일",
        type: "custom",
        customComponent: (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="date" 
              max="9999-12-31"
              id="startDate"
              style={{ marginBottom: "0" }}
              {...register("_startDate")}
            />
            <input type="date" 
            max="9999-12-31" 
            id="endDate" {...register("_endDate")}
            />
          </div>
        ),
      },

    // 금액 필드 (무료가 아닐 경우에만 표시)
    (watch("_paymentPlan") === "무료" ||
      (watch("_paymentPlan") && !watch("_payment"))) &&
      amountField,
  ].filter(Boolean);

  // 납부방법 초기화
  useEffect(() => {
    const paymentPlan = watch("_paymentPlan");
    if (paymentPlan === "무료") {
      setValue("_paymentDate", "");
      setValue("_payment", "");
      setValue("_endDate", "");
      setValue("_chargeStartDate", "");
      setValue("_chargeEndDate", "");
    }
  }, [watch("_paymentPlan")]);

  const remarkField = {
    label: "비고",
    id: "remark",
    value: watch("_remark") || "",
    onChange: handleRemarkChange,
    register: "_remark",
  };

  const radioButtons = (
    <div className="formContentWrap" style={{ width: "100%", height: "25px" }}>
      <div
        className="comtype"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <label>
          <input
            type="radio"
            value="개인"
            {...register("_comType")}
            checked={watch("_comType") === "개인"}
          />
          개인사업자
        </label>
        <label>
          <input
            type="radio"
            value="법인"
            {...register("_comType")}
            checked={watch("_comType") === "법인"}
          />
          법인사업자
        </label>
      </div>
    </div>
  );

  const creditCardFields = [
    {
      label: "카드사",
      type: "select",
      id: "_useBank",
      onChange: handleBankValueChange,
      options: ["신한 가맹점", "BC 가맹점", "효성 ( 카드사 )"],
      conditionalInput: selectedBankValue === "효성 ( 카드사 )",
      placeholder: "카드사를 입력해주세요",
      conditionalValue: hyosungBankName,
      conditionalOnChange: (e) => {
        setHyosungBankName(e.target.value);
        setValue("_useBank", `효성 (${e.target.value})`);
      },
      style: { width: "50%", textAlign: "center" },
    },
    {
      label: "카드소유자",
      type: "text",
      id: "name",
      register: "_name",
      onChange: (e) => handleKoreanOnlyInput(e, "_name"),
    },
    {
      label: "생년월일",
      type: "text",
      id: "birthDate",
      register: "_birthDate",
      value: formattedBirthDate,
      onChange: handleBirthDateChange,
    },
    {
      label: "계약자와의 관계",
      type: "text",
      id: "relationship",
      register: "_relationship",
      onChange: (e) => handleKoreanOnlyInput(e, "_relationship"),
    },
    {
      label: "카드번호",
      type: "text",
      id: "cardnum",
      register: "_cardnum",
      value: formattedCardNum,
      onChange: handleCardNumChange,
    },
    {
      label: "유효기간",
      type: "text",
      id: "cardValidnum",
      register: "_cardValidnum",
      value: formattedExpDate,
      onChange: handleExpDateChange,
      placeholder: "월 / 년",
    },
    {
      label: "할부 정보",
      type: "custom",
      customComponent: (
        <div className="formLayout">
          <div
            className="formContentWrap"
            style={{ width: "100%", height: "25px" }}
          >
            <div
              className="comtype"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <input
                className="listSearchRadioInput"
                type="radio"
                value="일시불"
                id="installment1"
                checked={installment === "일시불"}
                onChange={handleInstallmentChange}
                style={{ width: "10px", height: "10px", margin: "0 5px" }}
              />
              <label htmlFor="installment1" className="listSearchRadioLabel">
                일시불
              </label>

              <input
                className="listSearchRadioInput"
                type="radio"
                value="할부"
                id="installment2"
                checked={installment === "할부"}
                onChange={handleInstallmentChange}
                style={{ width: "10px", height: "10px", margin: "0 5px" }}
              />
              <label htmlFor="installment2" className="listSearchRadioLabel">
                할부
              </label>

              {installment === "할부" && (
                <input
                  type="number"
                  placeholder="개월 수"
                  value={installmentMonths}
                  onChange={handleInstallmentMonthsChange}
                  style={{
                    marginLeft: "11px",
                    width: "78%",
                    height: "24px",
                    marginRight: "0",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "승인번호",
      type: "text",
      id: "accountNum",
      register: "_accountNum",
      value: formattedAccountNum,
      onChange: handleAccountNumChange,
    },
    amountField,
    remarkField,
  ];

  // CMS 필드
  const cmsFields = [
    {
      label: "은행",
      type: "text",
      id: "useBank",
      register: "_useBank",
      value: cmsBankName,
      onChange: handleCmsBankNameChange,
      style: { width: "50%" },
    },
    {
      label: "CMS예금주",
      type: "text",
      id: "name",
      register: "_name",
      onChange: (e) => handleKoreanOnlyInput(e, "_name"),
    },
    {
      label: "CMS회원번호",
      type: "text",
      id: "cmsNum",
      register: "_cmsNum",
      value: formattedCmsNum,
      onChange: handleCMSNumChange,
    },
    {
      label: "생년월일",
      type: "text",
      id: "birthDate",
      register: "_birthDate",
      value: formattedBirthDate,
      onChange: handleBirthDateChange,
    },
    {
      label: "계약자와의 관계",
      type: "text",
      id: "relationship",
      register: "_relationship",
      onChange: (e) => handleKoreanOnlyInput(e, "_relationship"),
    },
    {
      label: "계좌번호",
      type: "text",
      id: "accountNum",
      register: "_accountNum",
      // value: formattedAccountNum,
      onChange: handleAccountNumChange,
    },
    {
      label: "사업자번호",
      type: "text",
      id: "registration",
      register: "_registration",
      value: formattedRegistration,
      onChange: handleBusinessNumberChange,
    },
    amountField,
    remarkField,
  ];

  // KT합산청구 필드
  // const ktFields = [
  //   // { label: "은행", type: "select", id: "useBank", register: "_useBank",  onChange: handleBankValueChange,
  //   // options: ["신한", "BC"],
  //   // conditionalOnChange: (e) => setAdditionalBankName(e.target.value), style: {width: '50%'} },
  //   {
  //     label: "KT합산청구번호",
  //     type: "text",
  //     id: "ktNum",
  //     register: "_ktNum",
  //     value: watch("_ktNum"),
  //     onChange: handleKTNumChange,
  //   },
  //   {
  //     label: "명의자",
  //     type: "text",
  //     id: "name",
  //     register: "_name",
  //     onChange: (e) => handleKoreanOnlyInput(e, "_name"),
  //   },
  //   {
  //     label: "계약자와의 관계",
  //     type: "text",
  //     id: "relationship",
  //     register: "_relationship",
  //     onChange: (e) => handleKoreanOnlyInput(e, "_relationship"),
  //   },
  //   {
  //     label: "생년월일",
  //     type: "text",
  //     id: "birthDate",
  //     register: "_birthDate",
  //     value: formattedBirthDate,
  //     onChange: handleBirthDateChange,
  //   },
  //   {
  //     label: "사업자구분",
  //     type: "custom",
  //     customComponent: radioButtons,
  //   },
  //   {
  //     label: "사업자 번호 / 법인번호",
  //     type: "text",
  //     id: "registration",
  //     register: "_registration",
  //     value: formattedRegistration,
  //     onChange: handleBusinessNumChange,
  //   },
  //   {
  //     label: "명의자 휴대폰",
  //     type: "text",
  //     id: "telnum",
  //     register: "_telnum",
  //     value: formattedPhoneNumber,
  //     onChange: handlePhoneNumberChange,
  //   },
  //   amountField,
  //   remarkField
  // ];

  //무통장입금 필드
  const bankTransferFields = [
    {
      label: "은행",
      type: "select",
      id: "_useBank",
      register: "_useBank",
      onChange: handleBankValueChange,
      options: currentBankOptions,
      style: { width: "50%", textAlign: 'center' },
    },
    {
      label: "계좌번호",
      type: "text",
      id: "accountNum",
      register: "_accountNum",
      readOnly: true,
      style: { width: "50%" },
    },
    {
      label: "입금자명",
      type: "text",
      id: "name",
      register: "_name",
      onChange: (e) => handleKoreanOnlyInput(e, "_name"),
      style: { width: "50%" },
    },
    amountField,
    remarkField,
  ];

  useEffect(() => {
  console.log("formattedAccountNum:", formattedAccountNum);
  console.log("_accountNum:", getValues("_accountNum"));
}, [formattedAccountNum, getValues("_accountNum")]);

  useEffect(() => {
    // 현재 결제 방식에 따른 은행 옵션 설정 로직을 제거
    if (currentPaymentMethod !== "CMS ( 자동이체 )") {
      const banksForMethod = paymentMethodToBanks[watchedPaymentMethod] || [];
      setCurrentBankOptions(banksForMethod);
      if (banksForMethod.length > 0 && !selectedBankValue) {
        setSelectedBankValue(banksForMethod[0]);
      } else if (!banksForMethod.includes(selectedBankValue)) {
        setSelectedBankValue("");
      }
    } else {
      setSelectedBankValue("");
    }
  }, [watchedPaymentMethod, selectedBankValue, currentPaymentMethod]);

  const renderPaymentFields = (fields) => {
    return fields.map((field, index) => (
      <div className="formContentWrap" style={{ width: "100%" }} key={index}>
        <div className="blockLabel">
          <span>{field.label}</span>
        </div>
        <div>
          {field.type === "select" ? (
            <select
              {...register(field.id)}
              value={selectedBankValue}
              onChange={field.onChange}
              style={field.style || { width: "50%", margin: "0" }}
            >
              {currentBankOptions.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === "custom" ? (
            field.customComponent
          ) : field.id === "_amount" ? (
            field.extraElement
          ) : field.id === "remark" ? (
            <textarea
              id={field.id}
              {...register(field.register)}
              value={field.value}
              onChange={field.onChange}
              style={{
                width: "100%",
                minHeight: "50px",
                border: "0.0625rem solid rgba(200,200,200,0.6)",
              }}
            />
          ) : (
            <input
              type={field.type}
              id={field.id}
              {...(field.register && register(field.register))}
              value={field.value}
              onChange={field.onChange}
              placeholder={field.placeholder}
              max="9999-12-31"
            />
          )}
          {field.conditionalInput && (
            <input
              type="text"
              placeholder={field.placeholder}
              value={field.conditionalValue}
              onChange={field.conditionalOnChange}
              style={field.style}
            />
          )}
        </div>
      </div>
    ));
  };

  return (
    click && (
      <div className="modal">
        <div className="modal-content" style={{ maxHeight: "48.25rem" }}>
          <div className="modal-header">
            <h2>결제정보</h2>
          </div>
          <div id="modal-body">
            {/* Charge Type Selection */}
            <div className="formContentWrap" style={{ width: "100%" }}>
              <div className="blockLabel">
                <span>결제방식</span>
              </div>
              <div className="formLayout">
                <div
                  className="formContentWrap"
                  style={{ width: "100%", height: "25px" }}
                >
                  <div
                    className="comtype"
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      value="가맹비 ( 선불 )"
                      {...register("_chargeType")}
                      checked={watch("_chargeType") === "가맹비 ( 선불 )"}
                      onChange={handleChargeTypeChange}
                      id="chargeType1"
                    />
                    <label
                      htmlFor="chargeType1"
                      className="listSearchRadioLabel"
                    >
                      {" "}
                      {/* label의 htmlFor 속성을 input의 id와 연결 */}
                      가맹비 ( 선불 )
                    </label>

                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      value="월 이용료 ( 후불 )"
                      {...register("_chargeType")}
                      checked={watch("_chargeType") === "월 이용료 ( 후불 )"}
                      onChange={handleChargeTypeChange}
                      id="chargeType2"
                    />
                    <label
                      htmlFor="chargeType2"
                      className="listSearchRadioLabel"
                    >
                      {" "}
                      {/* label의 htmlFor 속성을 input의 id와 연결 */}월 이용료
                      ( 후불 )
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* {watch("_chargeType") === "월 이용료 ( 후불 )" && watch("_payment") === "CMS ( 자동이체 )" && (
                <div className="formContentWrap" style={{ width: "100%" }}>
                  <div className="blockLabel">
                    <span>{paymentDateLabel}</span>
                  </div>
                  <div>
                    <select
                      {...register("_paymentDate")}
                      value={getValues("_paymentDate")}
                      onChange={(e) => setValue("_paymentDate", e.target.value)}
                      style={{ width: "100%" }}
                    >
                      {dateOptions.map((date, index) => (
                        <option key={index} value={date}>{date}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )} */}

            {watch("_chargeType") && (
              <div className="formContentWrap" style={{ width: "100%" }}>
                <div className="blockLabel">
                  <span>납부방법</span>
                </div>
                <div className="formLayout">
                  <div
                    className="formContentWrap"
                    style={{ width: "100%", height: "25px" }}
                  >
                    <div
                      className="comtype"
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <input
                        className="listSearchRadioInput"
                        type="radio"
                        value="선납"
                        {...register("_paymentPlan")}
                        id="paymentPlan2"
                      />
                      <label
                        htmlFor="paymentPlan2"
                        className="listSearchRadioLabel"
                      >
                        {" "}
                        {/* label의 htmlFor 속성을 input의 id와 연결 */}
                        선납
                      </label>

                      <input
                        className="listSearchRadioInput"
                        type="radio"
                        value="분납"
                        {...register("_paymentPlan")}
                        id="paymentPlan1"
                      />
                      <label
                        htmlFor="paymentPlan1"
                        className="listSearchRadioLabel"
                      >
                        {" "}
                        {/* label의 htmlFor 속성을 input의 id와 연결 */}
                        분납
                      </label>

                      <input
                        className="listSearchRadioInput"
                        type="radio"
                        value="무료"
                        {...register("_paymentPlan")}
                        id="paymentPlan3"
                      />
                      <label
                        htmlFor="paymentPlan3"
                        className="listSearchRadioLabel"
                      >
                        {" "}
                        {/* label의 htmlFor 속성을 input의 id와 연결 */}
                        무료
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {watch("_paymentMethod") === "선납" && (
              <>
                <div className="formContentWrap" style={{ width: "100%" }}>
                  <div className="blockLabel">
                    <span>선납시작일</span>
                  </div>
                  <div>
                  <input
                    type="text"
                    {...register("_StartDate")}
                  />
                  </div>
                </div>

                <div className="formContentWrap" style={{ width: "100%" }}>
                  <div className="blockLabel">
                    <span>선납만료일</span>
                  </div>
                  <div>
                    <input 
                      type="date" 
                      {...register("_EndDate")}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Unified Payment Method Selection */}
            {watch("_paymentPlan") !== "무료" && (
              <div className="formContentWrap" style={{ width: "100%" }}>
                <div className="blockLabel">
                  <span>결제수단</span>
                </div>
                <div>
                  <select
                    value={getValues("_payment")}
                    onChange={handlePaymentMethodChange}
                    id="payment"
                    {...register("_payment")}
                    style={{ width: "100%" }}
                  >
                    <option value="선택" style={{ textAlign: "center" }}>
                      선택
                    </option>
                    {watch("_chargeType") === "가맹비 ( 선불 )" && (
                      <>
                        <option
                          style={{ textAlign: "center" }}
                          value="무통장입금"
                        >
                          무통장입금
                        </option>
                        <option
                          style={{ textAlign: "center" }}
                          value="신용카드"
                        >
                          신용카드
                        </option>
                        <option
                          style={{ textAlign: "center" }}
                          value="CMS ( 자동이체 )"
                        >
                          CMS ( 자동이체 )
                        </option>
                      </>
                    )}
                    {watch("_chargeType") === "월 이용료 ( 후불 )" && (
                      <>
                        <option
                          style={{ textAlign: "center" }}
                          value="신용카드"
                        >
                          신용카드
                        </option>
                        <option
                          style={{ textAlign: "center" }}
                          value="CMS ( 자동이체 )"
                        >
                          CMS ( 자동이체 )
                        </option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            )}

            {/* {watch("_payment") === "신용카드" || watch("_payment") === "CMS ( 자동이체 )" || watch("_payment") === "무통장입금" ? (
                <div className="formContentWrap" style={{ width: "100%" }}>
                  <div className="blockLabel">
                    <span>결합상품</span>
                  </div>
                  <div className="formLayout">
                    <div className="formContentWrap" style={{ width: "100%", height: "25px" }}>
                      <div className="comtype" style={{ width: "100%", height: "100%", border: "none",display: "flex", justifyContent: 'center' }}>
                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          value="네"
                          {...register("_package")}
                          id="package1" 
                        />
                        <label htmlFor="package1" className="listSearchRadioLabel"> 
                          네
                        </label>

                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          value="아니요"
                          {...register("_package")}
                          id="package2"
                        />
                        <label htmlFor="package2" className="listSearchRadioLabel"> 
                          아니요
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null} */}

            {/* --------------- 필수입력 -------------------*/}
            {formFields.map((field, index) => (
              <div className="formContentWrap" style={{ width: "100%" }} key={index}>
                <div className="blockLabel">
                  <span>{field.label}</span>
                </div>
                <div style={field.extraElement ? { display: "flex", alignItems: "center" } : {}} >
                  {/* paymentDate 필드 렌더링 */}
                  {field.id === "paymentDate" &&
                  watch("_chargeType") === "월 이용료 ( 후불 )" ? (
                    watch("_payment") === "CMS ( 자동이체 )" ? (
                      <select
                        {...register(field.register)}
                        style={{ width: "100%", textAlign: "center" }}
                        defaultValue={cmsPaymentDate}
                        onChange={(e) => setCmsPaymentDate(e.target.value)}
                      >
                        {cmsPaymentDateOptions.map((date, idx) => (
                          <option key={idx} value={date}>
                            {date}
                          </option>
                        ))}
                      </select>
                    ) : field.id === "paymentDate" ? (
                      <input
                        type={field.type}
                        max="9999-12-31"
                        id={field.id}
                        {...register(field.register)}
                        value={creditCardPaymentDate}
                        readOnly
                      />
                    ) : null
                  ) : field.type === "custom" ? (
                    field.customComponent
                  ) : field.id === "amount" ? (
                    <div className="input-container">
                      <input
                        type={field.type}
                        id={field.id}
                        {...(field.register && register(field.register))}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      {field.extraElement && field.extraElement}
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      id={field.id}
                      {...(field.register && register(field.register))}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                </div>
              </div>
            ))}

            {localSelectedPaymentValue === "신용카드" ||
            watch("_payment") === "신용카드"
              ? renderPaymentFields(creditCardFields)
              : null}
            {localSelectedPaymentValue === "무통장입금" ||
            watch("_payment") === "무통장입금"
              ? renderPaymentFields(bankTransferFields)
              : null}
            {localSelectedPaymentValue === "CMS( 자동이체 )" ||
            watch("_payment") === "CMS( 자동이체 )"
              ? renderPaymentFields(cmsFields)
              : null}
            {watch("_payment") === "CMS ( 자동이체 )"
              ? renderPaymentFields(cmsFields)
              : null}
          </div>

          <div className="listSearchButtonWrap">
            <button
              onClick={(e) => {
                e.preventDefault();
                setClick(false);
              }}
            >
              {" "}
              취소
            </button>
            <button onClick={fnSubmit} disabled={!isValid}>
              등록
            </button>
          </div>
        </div>
      </div>
    )
  );
}
