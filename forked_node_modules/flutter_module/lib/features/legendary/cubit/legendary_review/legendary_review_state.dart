// ignore_for_file: public_member_api_docs, sort_constructors_first
part of 'legendary_review_cubit.dart';

class LegendaryReviewState extends Equatable {
  const LegendaryReviewState({
    this.status = BlocStatus.initial,
    this.reviews = const [],
    this.totalAmount = 0,
    this.totalAvg = 0,
    this.totalPercent,
    this.reviewStatus = BlocStatus.initial,
    this.sendReviewStatus = BlocStatus.initial,
    this.reviewed,
    this.filters,
  });

  final BlocStatus status;
  final List<MentorRatingUserModel> reviews;
  final int? totalAmount;
  final double? totalAvg;
  final RatingPercentModel? totalPercent;
  final BlocStatus reviewStatus;
  final MentorRatingUserModel? reviewed;
  final BlocStatus sendReviewStatus;
  final LegendaryReviewFilterResponseModel? filters;


  @override
  List<Object?> get props => [
        status,
        reviews,
        totalAmount,
        totalAvg,
        totalPercent,
        reviewStatus,
        reviewed,
        sendReviewStatus,
        filters,
      ];

  LegendaryReviewState copyWith({
    BlocStatus? status,
    List<MentorRatingUserModel>? reviews,
    int? totalAmount,
    double? totalAvg,
    RatingPercentModel? totalPercent,
    BlocStatus? reviewStatus,
    MentorRatingUserModel? reviewed,
    BlocStatus? sendReviewStatus,
    LegendaryReviewFilterResponseModel? filters,
  }) {
    return LegendaryReviewState(
      status: status ?? this.status,
      reviews: reviews ?? this.reviews,
      totalAmount: totalAmount ?? this.totalAmount,
      totalAvg: totalAvg ?? this.totalAvg,
      totalPercent: totalPercent ?? this.totalPercent,
      reviewStatus: reviewStatus ?? this.reviewStatus,
      reviewed: reviewed ?? this.reviewed,
      sendReviewStatus: sendReviewStatus ?? this.sendReviewStatus,
      filters: filters ?? this.filters,
    );
  }
}


enum UserSkill{
  sell,
  lead,
}