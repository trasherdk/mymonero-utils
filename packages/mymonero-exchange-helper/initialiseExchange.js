"use strict"

const { handleOfferError } = require("./ErrorHelper");
const ExchangeHelper = require("./index")

function checkDecimals (value, decimals) {
  console.log("checkDecimals:", value, decimals);
  const str = value.toString()
  const strArr = str.split('.')
  if (strArr.length > 1) {
    if (strArr[1].length >= decimals) {
      return false
    }
  }
  return true
}

function outCurrencyValueKeydownListener(event, exchangeHelper) {
  let outCurrencyValue = document.getElementById('outCurrencyValue');

  // Test whether the key is allowed or not, and abort execution if not allowed
  let allowableKeyArray = [37, 39, 46, 8]; // arrow keys, delete, backspace
  if (exchangeHelper.isValidKey(event, allowableKeyArray)) {
    // These are valid keypresses, but we don't need to request an offer from the API
    return false
  }

  let currencyTickerCode = document.getElementById("outCurrencySelectList").value;
  // We need to limit the number of decimals based on the selected currency
  // checkDecimals returns false if we exceed the second parameter in decimal places
  if (!checkDecimals(outCurrencyValue.value, exchangeHelper.currencyMetadata[currencyTickerCode].precision)) {
    console.log("Decimal limit reached");
    event.preventDefault()
    return false
  }

  allowableKeyArray = [110, 46, 190] // decimal point, delete, period
  if (exchangeHelper.isValidKey(event, allowableKeyArray)) {
    // These are valid keypresses, but we don't need to request an offer from the API
    return false
  }
  
  // numpad 0-9, numeric 0-9
  if ((event.which >= 48 && event.which <= 57) || (event.which >= 96 && event.which <= 105)) {
    // These are valid keypresses. Return true 
    return true
  }

  event.preventDefault()
}

function inCurrencyValueKeydownListener(event, exchangeHelper) {
  let inCurrencyValue = document.getElementById('inCurrencyValue');

  // Test whether the key is allowed or not, and abort execution if not allowed
  let allowableKeyArray = [37, 39, 46, 8]; // arrow keys, delete, backspace
  if (exchangeHelper.isValidKey(event, allowableKeyArray)) {
    // These are valid keypresses, but we don't need to request an offer from the API
    return false
  }

  let currencyTickerCode = document.getElementById("inCurrencySelectList").value;
  // We need to limit the number of decimals based on the selected currency
  // checkDecimals returns false if we exceed the second parameter in decimal places
  if (!checkDecimals(inCurrencyValue.value, exchangeHelper.currencyMetadata[currencyTickerCode].precision)) {
    console.log("Decimal limit reached");
    event.preventDefault()
    return false
  }

  allowableKeyArray = [110, 46, 190] // decimal point, delete, period
  if (exchangeHelper.isValidKey(event, allowableKeyArray)) {
    // These are valid keypresses, but we don't need to request an offer from the API
    return false
  }
  
  // numpad 0-9, numeric 0-9
  if ((event.which >= 48 && event.which <= 57) || (event.which >= 96 && event.which <= 105)) {
    // These are valid keypresses. Return true 
    return true
  }

  event.preventDefault()
}

function initialiseExchangeHelper(context, exchangeHelper) {
    // console.log(tc);
    console.log(context)
    // console.log(this);
    // console.log(ExchangeHelper);
    // let exchangeHelper = new ExchangeHelper();
    console.log("initialiseFunction invoked");
    console.log(exchangeHelper);
    // This isn't great for migrating to an external library, but presently, we bind `this` when we invoke this function in ECV.web.js
    console.log(this);
    const order = {}
    let orderStarted = false
    let orderCreated = false
    // let backBtn = document.getElementsByClassName('nav-button-left-container')[0];
    // backBtn.style.display = "none";
    let exchangePage = document.getElementById('orderStatusPage')
    let outAddressInput = document.getElementById('outAddress')
    let walletSelector = document.getElementById('wallet-selector')
    let walletOptions = document.getElementById('wallet-options')
    let exchangePageDiv = document.getElementById('exchangePage')
    let orderStatusPage = document.getElementById('orderStatusPage')
    let addressValidation = document.getElementById('address-messages')
    let serverValidation = document.getElementById('server-messages')
    let explanatoryMessage = document.getElementById('explanatory-message')
    let selectedWallet = document.getElementById('selected-wallet')
    let serverRatesValidation = document.getElementById('server-rates-messages')
    let inCurrencyValue = document.getElementById('inCurrencyValue')
    let outCurrencyValue = document.getElementById('outCurrencyValue')
    let validationMessages = document.getElementById('validation-messages')
    let orderBtn = document.getElementById('order-button')
    let orderStatusDiv = document.getElementById('exchangePage')
    let orderTimer = {}
    let currencyInputTimer
    
    function validateBTCAddress (address, ValidationLibrary) {
      // Replace this with our ChangeNow library's integration at some stage
      try {
        if (ValidationLibrary.validate(address) == false) {
          console.log(ValidationLibrary.validate(address))
          return false
        }
      } catch (Error) {
        console.log(Error)
      }
      console.log(ValidationLibrary.validate(address))
      return true
    }
  
    const outAddressInputListener = function () {
      const outAddressInput = document.getElementById('outAddress')
      addressValidation.innerHTML = ''
  
      console.log("We could leave address validation to the exchange server instead of validating three different address types")
      // if (validateBTCAddress(btcAddressInput.value, ValidationLibrary) == false) {
      //   const error = document.createElement('div')
      //   error.classList.add('message-label')
      //   error.id = 'btc-invalid'
      //   error.innerHTML = 'Your BTC address is not valid.'
      //   addressValidation.appendChild(error)
      // }
    }
  
    // const inCurrencyValueKeydownListener = function (event) {
    //   if (event.which == 8 || event.which == 110 || event.which == 46 || event.which == 190) { return }
  
    //   if ((event.which >= 48 && event.which <= 57) || (event.which >= 96 && event.which <= 105)) {
    //     return
    //   }
  
    //   if (!checkDecimals(inCurrencyValue.value, 12)) {
    //     event.preventDefault()
    //     return
    //   }
  
    //   event.preventDefault()
    // }
  
    // Tests whether the keypress is valid, checks currency precision, aborts if either fail
    const outCurrencyValueKeydownListener = function (event) {
      let outCurrencyValue = document.getElementById('outCurrencyValue');
  
      // Test whether the key is allowed or not, and abort execution if not allowed
      let allowableKeyArray = [37, 39, 46, 8]; // arrow keys, delete, backspace
      if (exchangeHelper.isValidKey(event, allowableKeyArray)) {
        // These are valid keypresses, but we don't need to request an offer from the API
        return false
      }
  
      let currencyTickerCode = document.getElementById("outCurrencySelectList").value;
      // We need to limit the number of decimals based on the selected currency
      // checkDecimals returns false if we exceed the second parameter in decimal places
      if (!checkDecimals(outCurrencyValue.value, exchangeHelper.currencyMetadata[currencyTickerCode].precision)) {
        console.log("Decimal limit reached");
        event.preventDefault()
        return false
      }
  
      allowableKeyArray = [110, 46, 190] // decimal point, delete, period
      if (exchangeHelper.isValidKey(event, allowableKeyArray)) {
        // These are valid keypresses, but we don't need to request an offer from the API
        return false
      }
      
      // numpad 0-9, numeric 0-9
      if ((event.which >= 48 && event.which <= 57) || (event.which >= 96 && event.which <= 105)) {
        // These are valid keypresses. Return true 
        return true
      }
  
      event.preventDefault()
    }

    // const outCurrencyValueKeydownListener = function (event) {
    //   let outCurrencyValue = document.getElementById('outCurrencyValue');
  
    //   // Test whether the key is allowed or not, and abort execution if not allowed
      
    //   let allowableKeyArray = [37, 39, 46, 8]; // arrow keys, delete, backspace
    //   if (exchangeHelper.isValidKey(event, allowableKeyArray)) {
    //     // These are valid keypresses, but we don't need to request an offer from the API
    //     return
    //   }
  
    //   let currencyTickerCode = document.getElementById("outCurrencySelectList").value;
    //   // arrow keys, delete, backspace
    //   // if (event.which == 37 || event.which == 39 || event.which == 46 || event.which == 8) {
    //   //   return
    //   // }
      
    //   // We need to limit the number of decimals based on the selected currency
    //   // checkDecimals returns false if we exceed the second parameter in decimal places
    //   if (!checkDecimals(outCurrencyValue.value, exchangeHelper.currencyMetadata[currencyTickerCode].precision)) {
    //     console.log("Decimal limit reached");
    //     event.preventDefault()
    //     return
    //   }
  
    //   allowableKeyArray = [110, 46, 190] // decimal point, delete, period
    //   if (exchangeHelper.isValidKey(event, allowableKeyArray)) {
    //     // These are valid keypresses, but we don't need to request an offer from the API
    //     return
    //   }
      
    //   // numpad 0-9, numeric 0-9
    //   if ((event.which >= 48 && event.which <= 57) || (event.which >= 96 && event.which <= 105)) {
    //     // These are valid keypresses. We need to request an offer from the API
    //     document.getElementById('')
  
    //     exchangeHelper.exchangeFunctions.getOfferWithOutAmount()
    //     return
    //   }
  
    //   event.preventDefault()
    // }
  
    // let inCurrencyGetOffer = function(inCurrency, outCurrency, inAmount) {
    //   exchangeHelper.exchangeFunctions.getOfferWithInAmount(inCurrency, outCurrency, inAmount)
    //       .then((response) => {
    //         const BTCToReceive = parseFloat(response.out_amount)
    //         let outCurrencyValue = document.getElementById('outCurrencyValue')
    //         outCurrencyValue.value = BTCToReceive.toFixed(8)
    //       }).catch((error) => {
    //         //handleOfferError(error)
    //         console.log(error);
    //         let errorDiv = exchangeHelper.errorHelper.handleOfferError(error);
    //         serverValidation.appendChild(errorDiv);
    //         orderBtn.style.display = 'block'
    //         orderStarted = false
    //       })
    // }
      // Coordinates the retrieval of a quote given an out currency and a in amount. Returns a value for outCurrencyValue
        // Coordinates the retrieval of a quote given an out currency and a out amount. Returns a value for inCurrencyValue
        let outCurrencyGetOffer = function(inCurrency, outCurrency, outAmount) {
          // Get inCurrencyType, outCurrencyType
          exchangeHelper.exchangeFunctions.getOfferWithOutAmount(inCurrency, outCurrency, outAmount)
            .then((response) => {
              console.log("Response for out currency");
              const XMRtoReceive = parseFloat(response.in_amount)
              const selectedWallet = document.getElementById('selected-wallet')
              const tx_feeElem = document.getElementById('tx-fee')
              const tx_fee = tx_feeElem.dataset.txFee
              const tx_fee_double = parseFloat(tx_fee)
              const walletMaxSpendDouble = parseFloat(selectedWallet.dataset.walletbalance)
              const walletMaxSpend = walletMaxSpendDouble - tx_fee
              // let BTCToReceive = inCurrencyValue.value * exchangeHelper.exchangeFunctions.currentRates.price;
              // let XMRbalance = parseFloat(inCurrencyValue.value);
              const BTCCurrencyValue = parseFloat(outCurrencyValue.value)
  
              if ((walletMaxSpend - XMRtoReceive) < 0) {
                const error = document.createElement('div')
                error.classList.add('message-label')
                error.id = 'xmrexceeded'
                error.innerHTML = `You cannot exchange more than ${walletMaxSpend} XMR`
                validationMessages.appendChild(error)
              }
  
              if (BTCCurrencyValue.toFixed(12) > exchangeHelper.exchangeFunctions.currentRates.upper_limit) {
                const error = document.createElement('div')
                error.id = 'xmrexceeded'
                error.classList.add('message-label')
                const btc_amount = parseFloat(exchangeHelper.exchangeFunctions.currentRates.upper_limit)
                error.innerHTML = `You cannot exchange more than ${btc_amount} BTC.`
                validationMessages.appendChild(error)
              }
              if (BTCCurrencyValue.toFixed(8) < exchangeHelper.exchangeFunctions.currentRates.lower_limit) {
                const error = document.createElement('div')
                error.id = 'xmrtoolow'
                error.classList.add('message-label')
                const btc_amount = parseFloat(exchangeHelper.exchangeFunctions.currentRates.lower_limit)
                error.innerHTML = `You cannot exchange less than ${btc_amount} BTC.`
                validationMessages.appendChild(error)
              }
              inCurrencyValue.value = XMRtoReceive.toFixed(12)
            }).catch((error) => {
              exchangeHelper.errorHelper.handleOfferError;(error)
            })
        }

        const outputBalanceChecks = exchangeHelper.eventListeners.outBalanceChecks;
        const inBalanceChecks = exchangeHelper.eventListeners.inBalanceChecks;
  
        function getRates() {
          // it's safe to refresh the sending fee here, because we know the HTML exists in the DOM
          //self._refresh_sending_fee();
          const exchangePage = document.getElementById('orderStatusPage')
          const loaderPage = document.getElementById('loader')
          const outAddressInput = document.getElementById('outAddress')
          const inCurrencyValue = document.getElementById('inCurrencyValue')
          const outCurrencyValue = document.getElementById('outCurrencyValue')
          const orderBtn = document.getElementById('order-button')
          const explanatoryMessage = document.getElementById('explanatory-message')
          const serverRatesValidation = document.getElementById('server-rates-messages')
          const validationMessages = document.getElementById('validation-messages')
          const walletSelector = document.getElementById('wallet-selector')
          const walletOptions = document.getElementById('wallet-options')
          const exchangePageDiv = document.getElementById('exchangePage')
          const orderStatusPage = document.getElementById('orderStatusPage')
          const addressValidation = document.getElementById('address-messages')
          const serverValidation = document.getElementById('server-messages')
          const selectedWallet = document.getElementById('selected-wallet')
          const orderStatusDiv = document.getElementById('exchangePage')
    
  
          let exchangeElements = {
            exchangePage: exchangePage,
            loaderPage: loaderPage,
            outAddressInput: outAddressInput,
            inCurrencyValue: inCurrencyValue,
            outCurrencyValue: outCurrencyValue,
            orderBtn: orderBtn,
            explanatoryMessage: explanatoryMessage,
            serverRatesValidation: serverRatesValidation,
            validationMessages: validationMessages,
            walletSelector: walletSelector,
            walletOptions: walletOptions,
            exchangePageDiv: exchangePageDiv,
            orderStatusPage: orderStatusPage,
            addressValidation: addressValidation,
            serverValidation: serverValidation,
            selectedWallet: selectedWallet,
            orderStatusDiv: orderStatusDiv
          }
          
          outAddressInput.addEventListener('input', exchangeHelper.eventListeners.outAddressInputListener)
          //inCurrencyValue.addEventListener('keydown', exchangeHelper.eventListeners.inCurrencyValueKeydownListener)
          //outCurrencyValue.addEventListener('keydown', exchangeHelper.eventListeners.outCurrencyValueKeydownListener)
          outCurrencyValue.addEventListener('keydown', outCurrencyValueKeydownListener)
          console.log(orderBtn);
          console.log("OrderBtnBindNext");
          //console.log(exchangeHelper.eventListeners.orderBtnClickedListener.bind())
          //orderBtn.addEventListener('click', exchangeHelper.eventListeners.orderButtonClickedListener)
          orderBtn.addEventListener('click', orderBtnClicked)
  
          outCurrencyValue.addEventListener('keyup', function (event) {
            //clearValidationMessages(alertValid);
            validationMessages.innerHTML = ''
            if (outCurrencyValue.value.length > 0) {
              exchangeHelper.eventListeners.outBalanceChecks()
            }
          })
  
          //outCurrencyValue.addEventListener('keyup', () => clearValidationMessages(exchangeHelper.eventListeners.btcBalanceChecks))
          //inCurrencyValue.addEventListener('keyup', () => clearValidationMessages(exchangeHelper.eventListeners.inBalanceChecks))
  
          // Add inBalanceChecks listener
          inCurrencyValue.addEventListener('keydown', function (event) {
            validationMessages.innerHTML = ''
            if (inCurrencyValue.value.length > -1) {
              console.log("keydown check init");
              if (inCurrencyValueKeydownListener(event, exchangeHelper) ) {
                try {
                  console.log("Trying here");
                  console.log(exchangeHelper.eventListeners.inBalanceChecks);
                  exchangeHelper.eventListeners.inBalanceChecks(exchangeElements, exchangeHelper.exchangeFunctions).then((response) => {
                    console.log(response);
                  }).catch((error) => {
                      let errorDiv = exchangeHelper.errorHelper.handleOfferError(error);
                      serverValidation.appendChild(errorDiv);
                      console.log("Caught error");
                  })
                } catch (error) {
                  //handleOfferError(error);
                  console.log(error.message);
                  console.log("Handled at 301");
                }
              } 
            }
          })

          outCurrencyValue.addEventListener('change', function (event) {
            validationMessages.innerHTML = ''
            if (outCurrencyValue.value.length > 0) {
              //exchangeHelper.eventListeners.inBalanceChecks()
              exchangeHelper.eventListeners.outBalanceChecks(exchangeElements, exchangeHelper.exchangeFunctions)
            }
          })
          
          serverRatesValidation.innerHTML = ''
          const retry = document.getElementById('retry-rates')
          const errorDiv = document.getElementById('retry-error')
          if (retry !== null) {
            retry.classList.add('hidden')
            errorDiv.classList.add('hidden')
          }
          exchangeHelper.exchangeFunctions.getRatesAndLimits().then(() => {
            loaderPage.classList.remove('active')
            exchangePage.classList.add('active')
          }).catch((error) => {
            /**/
            loaderPage.classList.remove('active')
            exchangePage.classList.add('active')
            if (retry !== null) {
              retry.classList.remove('hidden')
              errorDiv.classList.remove('hidden')
            } else {
              // KB: Remove this ---
  
              // end remove
  
              const errorDiv = document.createElement('div')
              errorDiv.innerText = "There was a problem with retrieving rates from the server. Please click the 'Retry' button to try connect again. The error message was: " + error.message
              errorDiv.id = 'retry-error'
              errorDiv.classList.add('message-label')
              const retryBtn = document.createElement('div')
              retryBtn.id = 'retry-rates'
              retryBtn.classList.add('base-button')
              retryBtn.classList.add('hoverable-cell')
              retryBtn.classList.add('navigation-blue-button-enabled')
              retryBtn.classList.add('action')
              retryBtn.innerHTML = 'Retry'
              retryBtn.addEventListener('click', getRates)
              explanatoryMessage.appendChild(errorDiv)
              explanatoryMessage.appendChild(retryBtn)
            }
          }).finally(() => {
            exchangeHelper.exchangeFunctions.initialiseExchangeConfiguration().then((response) => {
              // Data returned by resolve
              // If we get an error, we assume localmonero should be enabled 
              const localmoneroDiv = document.getElementById('localmonero')
              const localmoneroAnchor = document.getElementById('localmonero-anchor')
              localmoneroAnchor.setAttribute('referrer_id', response.data.referrer_info.localmonero.referrer_id)
              localmoneroAnchor.setAttribute('url', 'https://localmonero.co')
              localmoneroAnchor.setAttribute('param_str', 'rc')
  
              // if (response.referrer_info.indacoin.enabled === true) {
              //     indacoinDiv.style.display = "block";
              //     indacoinAnchor.addEventListener('click', openClickableLink);
              // }
              if (response.data.referrer_info.localmonero.enabled === true) {
                localmoneroDiv.style.display = 'block'
                localmoneroAnchor.addEventListener('click', exchangeHelper.openClickableLink)
              }
            }).catch(error => {
              const localmoneroDiv = document.getElementById('localmonero')
              const localmoneroAnchor = document.getElementById('localmonero-anchor')
  
              localmoneroAnchor.setAttribute('referrer_id', 'h2t1')
              localmoneroAnchor.setAttribute('url', 'https://localmonero.co')
              localmoneroAnchor.setAttribute('param_str', 'rc')
              // No data received from promise resolve(). Display link for LocalMonero
              localmoneroDiv.style.display = 'block'
              localmoneroAnchor.addEventListener('click', exchangeHelper.openClickableLink)
            })
          })
        }
  
        
  
        
  
        
  
        function isValidBase10Decimal (number) {
          const str = number.toString()
          const strArr = str.split('.')
          if (strArr.size > 1 && typeof (strArr) === Array) {
            return false
          }
          for (let i = 0; i < 2; i++) {
            if (isNaN(parseInt(strArr[i]))) {
              return false
            }
          }
          if (strArr.size > 1) {
            if (strArr[1].length == 0) {
              return false
            }
          }
          return true
        }
  
        function orderBtnClicked () {
          let validationError = false
          serverValidation.innerHTML = ''
          if (orderStarted == true) {
            return
          }
          if (validationMessages.firstChild !== null) {
            validationMessages.firstChild.style.color = '#ff0000'
            validationError = true
            return
          }
          if (addressValidation.firstChild !== null) {
            addressValidation.firstChild.style.color = '#ff0000'
            validationError = true
            return
          }
          const btc_dest_address = document.getElementById('outAddress').value
          let firstTick = true
          orderBtn.style.display = 'none'
          orderStarted = true
          // backBtn.style.display = "block";
          loaderPage.classList.add('active')
          let orderStatusResponse = { orderTick: 0 }
          const out_amount = document.getElementById('outCurrencyValue').value
          const in_currency = 'XMR'
          const out_currency = 'BTC'
          try {
            const offer = exchangeHelper.exchangeFunctions.getOfferWithOutAmount(in_currency, out_currency, out_amount).then((response) => {
  
            }).then((error, response) => {
              const selectedWallet = document.getElementById('selected-wallet')
  
              exchangeHelper.exchangeFunctions.createOrder(btc_dest_address, selectedWallet.dataset.walletpublicaddress).then((response) => {
                //document.getElementById('orderStatusPage').classList.remove('active')
                let e = document.getElementById('orderStatusPage');
                console.log(e);
                e = document.getElementById('orderStatusPage');
                console.log(e);
                loaderPage.classList.remove('active')
                orderStatusDiv.classList.add('active')
                exchangePageDiv.classList.add('active')
                // backBtn.innerHTML = `<div class="base-button hoverable-cell utility grey-menu-button disableable left-back-button" style="cursor: default; -webkit-app-region: no-drag; position: absolute; opacity: 1; left: 0px;"></div>`;
                orderTimer = setInterval(() => {
                  if (orderStatusResponse.hasOwnProperty('expires_at')) {
                    orderStatusResponse.orderTick++
                    exchangeHelper.renderOrderStatus(orderStatusResponse)
                    const expiryTime = orderStatusResponse.expires_at
                    const secondsElement = document.getElementById('secondsRemaining')
                    const minutesElement = document.getElementById('minutesRemaining')
                    if (secondsElement !== null) {
                      const minutesElement = document.getElementById('minutesRemaining')
                      const timeRemaining = exchangeHelper.timerHelper.getTimeRemaining(expiryTime)
                      minutesElement.innerHTML = timeRemaining.minutes
                      if (timeRemaining.seconds <= 9) {
                        timeRemaining.seconds = '0' + timeRemaining.seconds
                      }
                      secondsElement.innerHTML = timeRemaining.seconds
                      const xmr_dest_address_elem = document.getElementById('in_address')
                      xmr_dest_address_elem.value = response.receiving_subaddress
                    }
  
                    if (orderStatusResponse.status == 'PAID' || orderStatusResponse.status == 'TIMED_OUT' ||
                                  orderStatusResponse.status == 'DONE' || orderStatusResponse.status == 'FLAGGED_DESTINATION_ADDRESS' ||
                                  orderStatusResponse.status == 'PAYMENT_FAILED' || orderStatusResponse.status == 'REJECTED' ||
                                  orderStatusResponse.status == 'EXPIRED') {
                      clearInterval(localOrderTimer)
                    }
                  }
                  if ((orderStatusResponse.orderTick % 10) == 0) {
                    exchangeHelper.exchangeFunctions.getOrderStatus().then(function (response) {
                      const elemArr = document.getElementsByClassName('provider-name')
                      if (firstTick == true || elemArr[0].innerHTML == 'undefined') {
                        exchangeHelper.renderOrderStatus(response)
                        elemArr[0].innerHTML = response.provider_name
                        elemArr[1].innerHTML = response.provider_name
                        elemArr[2].innerHTML = response.provider_name
  
                        firstTick = false
                      }
                      let orderTick = orderStatusResponse.orderTick
                      orderTick++
                      response.orderTick = orderTick
                      orderStatusResponse = response
                    })
                  }
                }, 1000)
                document.getElementById('orderStatusPage').classList.remove('active')
              }).catch((error) => {
                //exchangeHelper.ErrorHelper.handleOfferError(error, exchangeElements);
                let errorDiv = exchangeHelper.errorHelper.handleOfferError;(error);
                serverValidation.appendChild(errorDiv);
                orderBtn.style.display = 'block'
                orderStarted = false
              })
            }).catch((error) => {
              let errorDiv = exchangeHelper.errorHelper.handleOfferError;(error);
              serverValidation.appendChild(errorDiv);
              orderBtn.style.display = 'block'
              orderStarted = false
            })
          } catch (Error) {
            console.log(Error)
          }
        }
        
        setTimeout(() => {
          const exchangeRendered = document.getElementById('orderStatusPage')
          if (exchangeRendered == null) {
            // do nothing -- this loop will run when order page is locked
          } else {
            function clearValidationMessages(callbackFunction = null) {
              if (typeof(callbackFunction) === "function") {
                callbackFunction('test');
              }
            }
    
            // bind to listener that will update the coin labels when the outCurrency is changed
            //document.getElementById('outCurrencySelectList').addEventListener('change', exchangeHelper.eventListeners.updateCurrencyLabels);
  
            getRates()
            // Safe to set fee because the DOM will have rendered
            
            let estimatedTotalFee_JSBigInt = context.monero_utils.estimated_tx_network_fee(null, 1, '24658');
            let estimatedFeeStr = exchangeHelper.htmlHelper.newEstimatedNetworkFeeString(estimatedTotalFee_JSBigInt);
            let feeElement = document.getElementById('tx-fee')
            // Safe to set up wallet selector since it'll have been rendered
            let walletSelector = document.getElementById('wallet-selector');
  
            exchangeHelper.renderWalletSelector(context.walletsListController.records, walletSelector);
            exchangeHelper.setSendingFee(estimatedFeeStr, feeElement)
          }
        }, 100)
      }



module.exports = initialiseExchangeHelper