// Copyright 2017 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.ruesga.rview.aceeditor;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.TypedValue;

import androidx.browser.customtabs.CustomTabsIntent;

class AceActivityHelper {
    static void openUriInCustomTabs(Activity activity, Uri uri) {
        try {
            CustomTabsIntent.Builder builder = new CustomTabsIntent.Builder();
            setToolbarColor(activity, builder);
            builder.setShowTitle(true);
            CustomTabsIntent intent = builder.build();

            String packageName = AceCustomTabsHelper.getPackageNameToUse(activity);
            if (packageName == null) {
                openUri(activity, uri);
                return;
            }

            intent.intent.setPackage(packageName);
            intent.launchUrl(activity, uri);

        } catch (ActivityNotFoundException ex) {
            // Fallback to default browser
            openUri(activity, uri);
        }
    }

    private static void openUri(Context ctx, Uri uri) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            ctx.startActivity(intent);

        } catch (ActivityNotFoundException ex) {
            // ignore
        }
    }

    private static void setToolbarColor(Context context, CustomTabsIntent.Builder builder) {
        TypedValue typedValue = new TypedValue();
        if (context.getTheme().resolveAttribute(R.attr.colorPrimaryDark, typedValue, true)) {
            builder.setToolbarColor(typedValue.data);
        }
    }
}