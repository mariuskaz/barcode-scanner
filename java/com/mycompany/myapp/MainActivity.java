package com.mycompany.myapp;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.DialogInterface.OnClickListener;
import android.os.Build;
import android.os.Bundle;
import android.webkit.JsPromptResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import android.widget.EditText;
import android.webkit.*; 
import android.view.Window;

public class MainActivity extends Activity {

	WebView webView;

	@SuppressWarnings("deprecation")
	@SuppressLint("SetJavaScriptEnabled")
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.main);
		webView = findViewById(R.id.webView);
		webView.setWebViewClient(new WebViewClient());
		webView.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);
		webView.setWebChromeClient(new WebChromeClient() {
				@Override
				public void onPermissionRequest(PermissionRequest request) {
					request.grant(request.getResources());
				}
		});

		webView.getSettings().setUserAgentString("Chrome");
		webView.getSettings().setJavaScriptEnabled(true);
		webView.getSettings().setDatabaseEnabled(true);
		webView.getSettings().setDomStorageEnabled(true);	
		webView.getSettings().setAllowUniversalAccessFromFileURLs(true);
		//webView.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
		webView.loadUrl("file:///android_asset/www/index.html");
	}

	@Override
	public void onBackPressed() {
		if (webView.canGoBack()) {
			webView.goBack();
		} else { 
			new AlertDialog.Builder(this)
				.setTitle("Inventorizacija")
				.setMessage("Baigti?")
				.setNegativeButton("Ne", null)
				.setPositiveButton("Taip", new DialogInterface.OnClickListener() {
					@Override
					public void onClick(DialogInterface dialog, int which) {
						finish();    
					}
				})
				.show();
		}
	}

}
