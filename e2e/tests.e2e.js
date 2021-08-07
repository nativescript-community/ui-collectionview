describe('Scroll Test', () => {
    beforeEach(async () => {
        await device.reloadReactNative();
    });

    const firstElement = 'TURQUOISE';
    const lastElement = 'ASBESTOS';

    it(`${firstElement} should be visible`, async () => {
        await expect(element(by.text(firstElement))).toBeVisible();
    });

    it(`${lastElement} should not be visible`, async () => {
        await expect(element(by.text(lastElement))).not.toBeVisible();
    });

    it('should scroll to bottom', async () => {
        await element(by.label('collectionView')).scrollTo('bottom');
    });

    it(`${lastElement} should be visible`, async () => {
        await expect(element(by.text(lastElement))).toBeVisible();
    });

    it(`${firstElement} should not be visible`, async () => {
        await expect(element(by.text(firstElement))).not.toBeVisible();
    });

    it('should scroll to top', async () => {
        await element(by.label('collectionView')).scrollTo('top');
    });
});
