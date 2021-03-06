/*
 * Copyright (C) 2017 Jorge Ruesga
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.ruesga.rview.model;

import android.os.Parcel;
import android.os.Parcelable;
import android.text.TextUtils;

import com.google.gson.annotations.SerializedName;

import androidx.annotation.NonNull;

public class ContinuousIntegrationInfo implements Parcelable, Comparable<ContinuousIntegrationInfo> {
    public enum BuildStatus {
        SUCCESS, FAILURE, SKIPPED, RUNNING
    }

    @SerializedName("name") public String mName;
    @SerializedName("url") public String mUrl;
    @SerializedName("status") public BuildStatus mStatus;

    public ContinuousIntegrationInfo(String name, String url, BuildStatus status) {
        mName = name;
        mUrl = url;
        mStatus = status;
    }

    protected ContinuousIntegrationInfo(Parcel in) {
        if (in.readInt() == 1) {
            mName = in.readString();
        }
        if (in.readInt() == 1) {
            mUrl = in.readString();
        }
        if (in.readInt() == 1) {
            mStatus = BuildStatus.valueOf(in.readString());
        }
    }

    public static final Creator<ContinuousIntegrationInfo> CREATOR =
            new Creator<ContinuousIntegrationInfo>() {
        @Override
        public ContinuousIntegrationInfo createFromParcel(Parcel in) {
            return new ContinuousIntegrationInfo(in);
        }

        @Override
        public ContinuousIntegrationInfo[] newArray(int size) {
            return new ContinuousIntegrationInfo[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        if (!TextUtils.isEmpty(mName)) {
            parcel.writeInt(1);
            parcel.writeString(mName);
        } else {
            parcel.writeInt(0);
        }
        if (!TextUtils.isEmpty(mUrl)) {
            parcel.writeInt(1);
            parcel.writeString(mUrl);
        } else {
            parcel.writeInt(0);
        }
        if (mStatus != null) {
            parcel.writeInt(1);
            parcel.writeString(mStatus.name());
        } else {
            parcel.writeInt(0);
        }
    }

    @Override
    public int compareTo(@NonNull ContinuousIntegrationInfo ci) {
        int compare = mName.compareToIgnoreCase(ci.mName);
        if (compare == 0) {
            compare = mUrl.compareTo(ci.mUrl);
        }
        return compare;
    }
}