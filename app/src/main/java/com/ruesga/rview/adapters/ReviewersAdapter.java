/*
 * Copyright (C) 2016 Jorge Ruesga
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
package com.ruesga.rview.adapters;

import android.content.Context;
import android.databinding.DataBindingUtil;
import android.text.Spannable;
import android.text.Spanned;
import android.text.TextUtils;
import android.text.style.StyleSpan;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Filter;
import android.widget.Filterable;

import com.ruesga.rview.R;
import com.ruesga.rview.databinding.ReviewerDropdownItemBinding;
import com.ruesga.rview.gerrit.GerritApi;
import com.ruesga.rview.gerrit.model.AccountInfo;
import com.ruesga.rview.gerrit.model.SuggestedReviewerInfo;
import com.ruesga.rview.misc.ModelHelper;

import java.util.ArrayList;
import java.util.List;

public class ReviewersAdapter extends BaseAdapter implements Filterable {

    private static final int MAX_RESULTS = 5;

    private Context mContext;
    private String mLegacyChangeId;
    private List<SuggestedReviewerInfo> mReviewers = new ArrayList<>();
    private final ReviewerFilter mFilter = new ReviewerFilter();

    public ReviewersAdapter(Context context, int legacyChangeId) {
        mContext = context;
        mLegacyChangeId = String.valueOf(legacyChangeId);
    }

    @Override
    public int getCount() {
        return mReviewers.size();
    }

    @Override
    public String getItem(int position) {
        return (String) formatSuggestionReviewer(mReviewers.get(position), false);
    }

    public SuggestedReviewerInfo getSuggestedReviewerAt(int position) {
        return mReviewers.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View v = convertView;
        if (v == null) {
            ReviewerDropdownItemBinding binding = DataBindingUtil.inflate(
                    LayoutInflater.from(mContext), R.layout.reviewer_dropdown_item, parent, false);
            v = binding.getRoot();
            v.setTag(binding);
        }

        SuggestedReviewerInfo reviewer = mReviewers.get(position);
        ReviewerDropdownItemBinding binding = (ReviewerDropdownItemBinding) v.getTag();
        binding.item.setText(formatSuggestionReviewer(reviewer, true));
        binding.executePendingBindings();

        return v;
    }

    @Override
    public Filter getFilter() {
        return mFilter;
    }

    private CharSequence formatSuggestionReviewer(
            SuggestedReviewerInfo reviewer, boolean highlight) {
        String text = null;
        if (reviewer.account != null) {
            text = formatAccount(reviewer.account);
        } else if (reviewer.group != null) {
            text = reviewer.group.name;
        }
        if (highlight) {
            return highlightOccurrences(text);
        }
        return text;
    }

    private String formatAccount(AccountInfo account) {
        StringBuilder sb = new StringBuilder();
        if (!TextUtils.isEmpty(account.name)) {
            sb.append(account.name);
        } else if (!TextUtils.isEmpty(account.username)) {
            sb.append(account.username);
        } else {
            sb.append(account.username);
        }
        if (!TextUtils.isEmpty(account.email)) {
            if (sb.length() == 0) {
                sb.append(account.email);
            } else {
                sb.append(" <").append(account.email).append(">");
            }
        }
        return sb.toString().trim();
    }

    private Spannable highlightOccurrences(String s) {
        String constraint = mFilter.mConstraint.toString().toLowerCase();
        Spannable spannable = Spannable.Factory.getInstance().newSpannable(s);

        int index = 0;
        int len = constraint.length();
        String s1 = s.toLowerCase();
        while (true) {
            index = s1.indexOf(constraint, index);
            if (index == -1) {
                break;
            }

            final StyleSpan bold = new StyleSpan(android.graphics.Typeface.BOLD);
            spannable.setSpan(bold, index, index + len, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            index += len;
        }

        return spannable;
    }


    private class ReviewerFilter extends Filter {

        private CharSequence mConstraint;

        @Override
        protected FilterResults performFiltering(CharSequence constraint) {
            FilterResults results = new FilterResults();
            if (constraint != null) {
                List<SuggestedReviewerInfo> reviewers =
                        fetchSuggestedReviewers(constraint.toString());
                results.values = reviewers;
                results.count = reviewers.size();
            }
            return results;
        }

        @Override
        @SuppressWarnings("unchecked")
        protected void publishResults(CharSequence constraint, FilterResults results) {
            mConstraint = constraint;
            mReviewers.clear();
            if (results.count > 0) {
                mReviewers.addAll((List<SuggestedReviewerInfo>) results.values);
                notifyDataSetChanged();
            } else {
                notifyDataSetInvalidated();
            }
        }

        @SuppressWarnings("ConstantConditions")
        private List<SuggestedReviewerInfo> fetchSuggestedReviewers(String query) {
            final GerritApi api = ModelHelper.getGerritApi(mContext);
            return api.getChangeSuggestedReviewers(mLegacyChangeId, query, MAX_RESULTS)
                    .toBlocking()
                    .first();
        }

    }

}