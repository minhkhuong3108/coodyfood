package com.coodyfood

import android.app.Application
import android.content.Context
import com.coodyfood.zpmodule.PayZaloBridge
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.shell.MainReactPackage
import com.facebook.soloader.SoLoader
import vn.zalopay.sdk.ZaloPaySDK
import java.lang.reflect.InvocationTargetException

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
             // add(MainReactPackage())
              add(PayZaloBridge())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
  }
}


//override val reactNativeHost: ReactNativeHost = object : ReactNativeHost(this) {
//  override fun getUseDeveloperSupport(): Boolean {
//    return BuildConfig.DEBUG
//  }
//
//  override fun getPackages(): List<ReactPackage> {
//    val packages = PackageList(this).packages.toMutableList()
//    // Thêm PayZaloBridge vào danh sách các gói
//    packages.add(PayZaloBridge())
//    return packages
//  }
//
//  override fun getJSMainModuleName(): String {
//    return "index"
//  }
//
//  override fun getJSBundleFile(): String? {
//    return if (BuildConfig.DEBUG) {
//      super.getJSBundleFile()
//    } else {
//      null // hoặc trả về đường dẫn đến bundle file của bạn nếu có
//    }
//  }
//
//  override fun getBundleAssetName(): String? {
//    return if (BuildConfig.DEBUG) {
//      super.getBundleAssetName()
//    } else {
//      null // hoặc trả về tên của bundle asset nếu có
//    }
//  }
//}
//
//override fun onCreate() {
//  super.onCreate()
//  SoLoader.init(this, /* native exopackage */ false)
//  initializeFlipper(this) // Remove this line if you don't want Flipper enabled
//  ZaloPaySDK.init(2553, vn.zalopay.sdk.Environment.SANDBOX)
//}
//
//private fun initializeFlipper(context: Context) {
//  if (BuildConfig.DEBUG) {
//    try {
//      val aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper")
//      aClass.getMethod("initializeFlipper", Context::class.java).invoke(null, context)
//    } catch (e: ClassNotFoundException) {
//      e.printStackTrace()
//    } catch (e: NoSuchMethodException) {
//      e.printStackTrace()
//    } catch (e: IllegalAccessException) {
//      e.printStackTrace()
//    } catch (e: InvocationTargetException) {
//      e.printStackTrace()
//    }
//  }
//}