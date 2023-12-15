package com.component

import android.content.Intent
import android.hardware.biometrics.BiometricManager.Authenticators.BIOMETRIC_STRONG
import android.hardware.biometrics.BiometricManager.Authenticators.DEVICE_CREDENTIAL
import android.os.Bundle
import android.provider.Settings
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class ComponentModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {
val reactContext:ReactApplicationContext=reactContext
  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun multiply() {
    val enrollIntent = Intent(Settings.ACTION_BIOMETRIC_ENROLL).apply {
      putExtra(Settings.EXTRA_BIOMETRIC_AUTHENTICATORS_ALLOWED,
        BIOMETRIC_STRONG)
    }
    val bunde= Bundle()
    reactContext.startActivityForResult(enrollIntent, 1,null)
  }

  companion object {
    const val NAME = "Component"
  }
}
