# API Routes - Trainer Portal (Web)

**IMPORTANTE:** Estas rotas devem ser IDÊNTICAS ao elemento26-app (Mobile)

## Auth
- `POST /auth/login`
- `POST /auth/signup`
- `POST /auth/apple`
- `GET /auth/me`
- `POST /auth/forgot-password`
- `POST /auth/verify-reset-code`
- `POST /auth/reset-password`
- `POST /auth/change-password`
- `DELETE /auth/account`

## Users / Profile
- `GET /users/profile`
- `PATCH /users/profile`
- `PATCH /users/me`
- `PUT /users/{userId}/avatar` (upload)

## Programs
- `GET /programs`
- `POST /programs`
- `GET /programs/{id}`
- `PATCH /programs/{id}`
- `DELETE /programs/{id}`
- `POST /programs/{id}/destroy_async`
- `GET /programs/add_day_to_week/{id}/{week}` ⚠️ GET for mutation
- `GET /programs/addweek/{id}` ⚠️ GET for mutation
- `POST /programs/{program_id}/add_workout_to_day`
- `DELETE /programs/{id}/remove_workout_from_day`
- `DELETE /programs/{id}/destroy_program_day`
- `PUT /programs/{id}/update_days`
- `GET /programs/by_uuid/{uuid}`
- `GET /programs/generation/{uuid}`

## Workouts
- `GET /workouts`
- `POST /workouts`
- `GET /workouts/{id}`
- `PATCH /workouts/{id}`
- `DELETE /workouts/{id}`
- `POST /workouts/{workout_id}/add_workout_exercise`
- `POST /workouts/{workout_id}/supersets`
- `PUT /workouts/{workout_id}/supersets/{superset_id}`
- `PATCH /workouts/{workout_id}/supersets/{superset_id}/update_full`
- `DELETE /workouts/{workout_id}/exercises/{exercise_id}`
- `PUT /workouts/{id}/finish`
- `POST /workouts/{workout_id}/finish_async`
- `PUT /workouts/{id}/restart`
- `PUT /workouts/{id}/undo`
- `PATCH /workouts/{workout_id}/reorder`

## Exercises
- `GET /exercises` (with query param `?q=search`)
- `POST /exercises`
- `GET /exercises/{id}`
- `PATCH /exercises/{id}`
- `DELETE /exercises/{id}`
- `GET /body_parts`
- `GET /categories`
- `GET /scores`
- `PUT /workouts_exercises/{id}`
- `POST /workouts_exercises/{workouts_exercise_id}/finish_async`

## History
- `GET /history`
- `POST /history/workouts`
- `GET /history/exercises/{exerciseId}/executions`

## Subscriptions
- `GET /subscriptions/plans`
- `GET /subscriptions/current`
- `POST /subscriptions/checkout`
- `POST /subscriptions/apple/confirm`
- `POST /subscriptions/cancel`
- `POST /subscriptions/reactivate`

## Professional Profiles
- `GET /professional_profiles`
- `GET /professional_profiles/{uuid}`
- `POST /professional_profiles/{profileId}/portfolio` (upload)
- `DELETE /professional_profiles/{profileId}/portfolio/{attachmentId}`

## Uploads / Assets
- `POST /{assetableType}/{assetableId}/assets`
- `DELETE /{assetableType}/{assetableId}/assets`
- `DELETE /assets/{assetId}`

## Notifications
- `GET /notifications`
- `POST /notifications/clear`
- `POST /notifications/{id}/read`

## Feature Flags
- `GET /feature_flags`
- `GET /feature_flags/{flagName}`

## Async Operations
- `GET /async_operations/{uuid}`

## AI Generation
- `POST /programs/ai_generate`
- `POST /programs/ai_generate_from_text`
- `POST /programs/ai_generate_async`
- `POST /programs/ai_generate_from_text_async`

## Support (⚠️ Asana Integration)
Mobile uses Asana API directly, not HTTP endpoints. Backend should handle Asana integration server-side.
- No direct HTTP routes in trainer-portal
