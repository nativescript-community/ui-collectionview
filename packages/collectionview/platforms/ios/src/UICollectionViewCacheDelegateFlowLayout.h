@interface UICollectionViewCacheDelegateFlowLayout: NSObject <UICollectionViewDelegateFlowLayout>

@property (nonatomic, retain) NSMutableArray* cachedSizes;

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout computedSizeForItemAtIndexPath:(NSIndexPath *)indexPath;
@end
