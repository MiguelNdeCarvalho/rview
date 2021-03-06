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
package com.ruesga.rview.gerrit.filter;

import java.util.Locale;

public enum Relation {
    GREATER_OR_EQUALS_THAN(">="), GREATER_THAN(">"), LOWER_OR_EQUALS_THAN("<="),
    LOWER_THAN("<"), EXACT_EQUALS_THAN("="), EQUALS_THAN("");

    public final String mRelation;
    Relation(String relation) {
        mRelation = relation;
    }

    public String toQuery(int value) {
        String relation = mRelation.equals(EXACT_EQUALS_THAN.mRelation)
                ? EQUALS_THAN.mRelation : mRelation;
        return String.format(Locale.US, "%s%d", relation, value);
    }
}
