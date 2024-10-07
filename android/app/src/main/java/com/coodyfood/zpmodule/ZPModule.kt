package com.coodyfood.zpmodule

import android.content.Intent
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import vn.zalopay.sdk.ZaloPayError
import vn.zalopay.sdk.ZaloPaySDK
import vn.zalopay.sdk.listeners.PayOrderListener

class ZPModule(private val mReactContext: ReactApplicationContext) : ReactContextBaseJavaModule(
    mReactContext
) {
    val PAYMENTSUCCESS: String = "1"
    val PAYMENTFAILED: String = "-1"
    val PAYMENTCANCELED: String = "4"

    var listener: PayOrderListener = object : PayOrderListener {
        override fun onPaymentSucceeded(
            transactionId: String,
            transToken: String,
            appTransID: String
        ) {
            // Handle Success
            val params = Arguments.createMap()
            params.putString("transactionId", transactionId)
            params.putString("transToken", transToken)
            params.putString("appTransID", appTransID)
            params.putString("returnCode", PAYMENTSUCCESS)
            sendEvent(mReactContext, "EventPayZalo", params)
        }

        override fun onPaymentCanceled(transToken: String, appTransID: String) {
            // Handle Cancel
            val params = Arguments.createMap()
            params.putString("returnCode", PAYMENTCANCELED)
            params.putString("zpTranstoken", transToken)
            params.putString("appTransID", appTransID)
            sendEvent(mReactContext, "EventPayZalo", params)
        }

        override fun onPaymentError(
            zaloPayError: ZaloPayError,
            transToken: String,
            appTransID: String
        ) {
            // Handle Error
            val params = Arguments.createMap()
            params.putString("returnCode", PAYMENTFAILED)
            params.putString("zpTranstoken", transToken)
            params.putString("appTransID", appTransID)
            sendEvent(mReactContext, "EventPayZalo", params)
        }
    }

    var activityEventListener: BaseActivityEventListener = object : BaseActivityEventListener() {
        override fun onNewIntent(intent: Intent) {
            super.onNewIntent(intent)
        }
    }

    init {
        mReactContext.addActivityEventListener(activityEventListener)
    }

    override fun getName(): String {
        return "PayZaloBridge"
    }

    @ReactMethod
    fun payOrder(zpTransToken: String?) {
        val currentActivity = currentActivity
        ZaloPaySDK.getInstance().payOrder(
            currentActivity!!,
            zpTransToken!!, "demozpdk://app", listener
        )
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Set up any upstream listeners or background tasks as necessary
    }


    @ReactMethod
    fun removeListeners(count: Int) {
        // Remove upstream listeners, stop unnecessary background tasks
    }

    @ReactMethod
    fun installApp() {
        ZaloPaySDK.getInstance().navigateToZaloOnStore(mReactContext)
    }

    private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap) {
        reactContext.getJSModule(
            DeviceEventManagerModule.RCTDeviceEventEmitter::class.java
        )
            .emit(eventName, params)
    }
}